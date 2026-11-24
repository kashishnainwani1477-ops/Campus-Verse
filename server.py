import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


PROJECT_FOLDER = Path(__file__).resolve().parent
OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions"
SYSTEM_PROMPT = """You are the friendly CampusVerse campus assistant. Answer clearly and naturally.

Only provide factual help about CampusVerse and its listed campus features. Use these
verified details:
- Events: Music Fest, Tech Fest, Cultural Fest, and Sports Meet. Dates are to be
  announced. The first three list the college campus as venue; Sports Meet lists
  the college ground. Students can register from Events & Fests.
- Clubs: Coding Club, Photography Club, Music Club, and Sports Club. Students can
  join through Clubs & Societies.
- Communities: Coding Club, Photography Club, Music Club, and Sports Club are
  listed as communities and can be joined from Communities.
- Polls: students can vote on their favorite event and what the college should
  improve. The site stores one vote per poll in that browser.
- Lost & Found: students can report a lost or found item with its type, description,
  location, and contact details.
- Event registrations ask for the student's name, email, and course/year. Saved
  registrations appear under My Registrations.
- The login/signup forms are currently a website demo and do not authenticate
  accounts against a real user database.

Do not invent event dates, policies, contact details, campus facts, or personal
student information. If a CampusVerse fact is not listed here, say you do not know
and suggest checking with campus staff. If asked something unrelated to CampusVerse,
politely say you are focused on CampusVerse and offer help with its features. You
may briefly respond to greetings before offering campus help."""


def send_json(handler, status, data):
    body = json.dumps(data).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(body)


class CampusVerseHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_FOLDER), **kwargs)

    def translate_path(self, path):
        requested_path = Path(super().translate_path(path)).resolve()
        try:
            relative_path = requested_path.relative_to(PROJECT_FOLDER)
        except ValueError:
            return str(PROJECT_FOLDER / "__not_found__")

        if any(part.startswith(".") for part in relative_path.parts):
            return str(PROJECT_FOLDER / "__not_found__")
        return str(requested_path)

    def do_POST(self):
        if self.path != "/api/chat":
            send_json(self, 404, {"error": "This endpoint was not found."})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            send_json(self, 400, {"error": "The request was not valid."})
            return

        if content_length <= 0:
            send_json(self, 400, {"error": "Please enter a message."})
            return
        if content_length > 32_000:
            send_json(self, 413, {"error": "This conversation is too long. Please start a new one."})
            return

        try:
            request_data = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            send_json(self, 400, {"error": "The request was not valid JSON."})
            return

        messages = request_data.get("messages") if isinstance(request_data, dict) else None
        if not isinstance(messages, list) or not messages or len(messages) > 20:
            send_json(self, 400, {"error": "Please send a valid chat message."})
            return

        validated_messages = []
        for message in messages:
            if not isinstance(message, dict):
                send_json(self, 400, {"error": "The chat history was not valid."})
                return
            role = message.get("role")
            content = message.get("content")
            if role not in ("user", "assistant") or not isinstance(content, str):
                send_json(self, 400, {"error": "The chat history was not valid."})
                return
            content = content.strip()
            if not content or len(content) > 2_000:
                send_json(self, 400, {"error": "Messages must contain between 1 and 2,000 characters."})
                return
            validated_messages.append({"role": role, "content": content})

        if validated_messages[-1]["role"] != "user":
            send_json(self, 400, {"error": "The latest chat message must be from the user."})
            return

        api_key = os.environ.get("OPENAI_API_KEY", "").strip()
        if not api_key:
            send_json(self, 503, {"error": "The AI assistant is not configured yet. Set OPENAI_API_KEY on the server and restart it."})
            return

        payload = {
            "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                *validated_messages,
            ],
            "temperature": 0.4,
            "max_tokens": 400,
        }
        request = Request(
            OPENAI_CHAT_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": "Bearer " + api_key,
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
            reply = result["choices"][0]["message"]["content"].strip()
            if not reply:
                raise ValueError("The model returned an empty message.")
        except HTTPError as error:
            print("OpenAI API returned HTTP", error.code)
            send_json(self, 502, {"error": "The AI service could not answer right now. Please try again."})
            return
        except (URLError, TimeoutError) as error:
            print("Could not reach OpenAI API:", error)
            send_json(self, 502, {"error": "Could not connect to the AI service. Check your connection and try again."})
            return
        except (json.JSONDecodeError, KeyError, IndexError, TypeError, ValueError) as error:
            print("OpenAI API returned an invalid response:", error)
            send_json(self, 502, {"error": "The AI service returned an invalid response. Please try again."})
            return

        send_json(self, 200, {"reply": reply})


def main():
    host = os.environ.get("CAMPUSVERSE_HOST", "127.0.0.1")
    port = int(os.environ.get("CAMPUSVERSE_PORT", "8000"))
    server = ThreadingHTTPServer((host, port), CampusVerseHandler)
    print("CampusVerse is running at http://{}:{}/".format(host, port))
    if not os.environ.get("OPENAI_API_KEY"):
        print("Set OPENAI_API_KEY in this terminal to enable AI replies.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping CampusVerse server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
