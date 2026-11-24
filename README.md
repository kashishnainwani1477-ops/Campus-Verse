# CampusVerse – Your Campus University Hub

CampusVerse is a student-focused campus website that brings event listings, clubs, communities, polls, lost-and-found reports, event registration, and an AI campus assistant together in one place. It is built as a lightweight web project with a Python server and browser-based interface.

> **Project status:** This is a front-end demonstration. Most student activity is saved in the current browser, not in a shared server-side database. Login and signup are demo forms and do not authenticate users.

## Project Overview

CampusVerse provides a single-page campus hub for exploring sample campus activities and trying common student-facing workflows. The interface is implemented in one HTML document, styled with CSS, and enhanced with JavaScript. A small Python server serves the website and provides a server-side endpoint that forwards chat requests to OpenAI.

The project does **not** include a user database, shared campus data service, or persistent backend for events, votes, registrations, clubs, communities, or lost-and-found reports. Browser-saved data is local to that browser profile.

## Problem Statement

Students often need to look in different places to learn about campus events, clubs, student groups, and practical services. CampusVerse demonstrates how a central campus hub could make those activities easier to discover and use. It brings sample information and interactive demonstrations into one interface while highlighting areas that would need real campus data and backend services for production use.

## Project Objectives

- Present common campus activities through a clear, responsive interface.
- Let students explore sample events, clubs, communities, and campus polls.
- Demonstrate browser-based event registration and lost-and-found reporting.
- Provide an AI assistant for questions about the campus features represented in the project.
- Keep the OpenAI API key on the server side rather than in browser JavaScript.
- Make the project approachable to run locally without installing third-party Python packages.

## Key Features and Modules

### Home Page

The landing page introduces CampusVerse and provides an **Explore Campus** action that scrolls to the feature cards. A navigation bar includes links to the main landing-page sections and a Login button.

### Events and Fests

The events page lists four sample events: **Music Fest**, **Tech Fest**, **Cultural Fest**, and **Sports Meet**. Dates are marked “To be announced”; venues are shown in the page. These are sample listings, not live event feeds.

### Clubs and Societies

Students can join the listed Coding, Photography, Music, and Sports clubs. Joined club names are stored in the browser's `localStorage` and displayed in the **My Joined Clubs** area.

### Campus Communities

The page lists Coding, Photography, Music, and Sports communities. Joining is demonstrated with a confirmation and duplicate-join check; the joined-community names are stored in the browser's `localStorage`. There is no shared membership service.

### Student Polls

Two sample polls let a visitor select an answer. The browser stores one answer per poll, prevents another vote in that browser, and displays the visitor's own saved choice. The app does not collect or show campus-wide aggregate results.

### Lost and Found

Visitors can submit a Lost or Found report with an item name, description, location, and contact details. Reports are saved in the browser's `localStorage`, displayed on the page, and can be removed from that browser.

### Event Registration

The event cards open a registration form for the selected event. The form asks for a name, email, and course/year. Submitted registrations are saved in browser storage.

### My Registrations

This page displays the registrations saved in the current browser. It is not tied to an authenticated account and does not synchronize across browsers or devices.

### AI Campus Assistant Chatbot

The assistant sends chat messages from the browser to the local Python server's `/api/chat` endpoint. The server calls the OpenAI Chat Completions API using `OPENAI_API_KEY` from its environment. Its configured instructions focus responses on the campus information represented in the project. A valid API key and network access to OpenAI are required for AI replies.

The interface includes both the assistant page markup and a floating chat panel. The page navigation opens the floating panel when **AI Assistant** is selected.

## Technologies Used

Only technologies and APIs present in the project are listed:

- **HTML5** — page structure and forms (`index.html`)
- **CSS3** — layout, responsive styling, and visual design (`style.css` and embedded page styles)
- **JavaScript** — page navigation and client-side interactions
- **Web Storage API (`localStorage`)** — browser-local demo data
- **Python 3 standard library** — local static-file server and chat API proxy
- **OpenAI Chat Completions API** — AI responses, when configured with a valid key

There is no frontend framework, package manager manifest, database, or third-party Python dependency in the project folder.

## Project Folder Structure

The current project files are all at the repository root; there are no source subdirectories.

```text
CampusVerse/
├── .gitignore
├── ai-assistant.js
├── chatbot.js
├── clubs.js
├── index.html
├── lostfound.js              # Empty file; not loaded by the page
├── lostfound2.js
├── Pictures - Shortcut.lnk   # Windows shortcut; not used by the app
├── script.js
├── server.py
├── style.css
└── Untitled                  # Empty file
```

`index.html` contains the page markup and some inline interaction logic. It loads the JavaScript files shown above, except for the empty `lostfound.js`.

## System Architecture

```text
Browser
├── index.html + style.css
├── JavaScript page interactions
├── localStorage
│   └── Demo registrations, votes, reports, and club/community joins
└── Chat messages
        │ POST /api/chat
        ▼
Python server (server.py, default 127.0.0.1:8000)
├── Serves the project files
├── Reads OPENAI_API_KEY from the server environment
└── Forwards validated chat requests over HTTPS
        │
        ▼
OpenAI Chat Completions API
```

The Python server uses the standard library's `http.server` and `urllib` modules. Application data other than chat requests is not sent to or stored by this server.

## Installation Requirements

- Python **3.7 or later** (the server uses `ThreadingHTTPServer`).
- A modern browser with JavaScript and `localStorage` support.
- Internet access and a valid OpenAI API key to use AI replies.
- No `pip`, npm, or other package installation is required.

## Step-by-Step Installation Guide

1. **Get the project files.** Clone the GitHub repository or download and extract its ZIP archive.
2. **Open a terminal** in the project root (the folder containing `server.py` and `index.html`).
3. **Check Python is available:**

   ```powershell
   python --version
   ```

   On systems where Python is invoked as `python3`, use:

   ```bash
   python3 --version
   ```

4. **No dependency installation is needed.** The server uses Python's standard library.
5. **Optionally configure the OpenAI API key** as described in [How to Configure the OpenAI API Key](#how-to-configure-the-openai-api-key-securely-using-environment-variables). The rest of the site can be explored without it; AI responses will not work until a valid key is configured.

## How to Run the Project Locally

Run the server from the project root.

**Windows PowerShell:**

```powershell
cd C:\path\to\CampusVerse
python server.py
```

**macOS/Linux terminal:**

```bash
cd /path/to/CampusVerse
python3 server.py
```

The server prints its address when it starts. With the default settings, open **http://127.0.0.1:8000/** in your browser. Keep the terminal open while using the site. Press **Ctrl+C** in that terminal to stop the server.

If port `8000` is already in use, choose another port before starting the server:

```powershell
$env:CAMPUSVERSE_PORT = "8001"
python server.py
```

Then open **http://127.0.0.1:8001/**. On macOS/Linux, use `CAMPUSVERSE_PORT=8001 python3 server.py`.

## How to Configure the OpenAI API Key Securely Using Environment Variables

The server reads `OPENAI_API_KEY` from its process environment. The browser does not need the key; do not put it in `index.html`, JavaScript, or any file committed to the repository.

Set the variable in the same terminal session **before** starting the server:

**Windows PowerShell:**

```powershell
$env:OPENAI_API_KEY = "your-valid-openai-api-key"
python server.py
```

**macOS/Linux (bash or a compatible shell):**

```bash
export OPENAI_API_KEY="your-valid-openai-api-key"
python3 server.py
```

Replace the example value locally; never share or commit a real key. These commands set the key for the current terminal session. To stop using it, close that terminal or clear it in PowerShell with `$env:OPENAI_API_KEY = $null` (in bash, run `unset OPENAI_API_KEY`).

The repository's `.gitignore` excludes `.env` files, but **the project does not load `.env` files**. Simply creating one will not configure the server. Use your terminal or a trusted environment-variable manager. The optional `OPENAI_MODEL` environment variable selects the model; the code defaults to `gpt-4o-mini`.

## How to Use Each Module

1. **Home:** Visit the site root, browse the feature cards, or select **Explore Campus** to scroll to them.
2. **Login / Sign Up:** Open Login from the home page and switch between the forms. These are demonstrations only: entered credentials are not checked against or saved to a user database. The login form accepts non-empty email/password fields and shows a welcome message.
3. **Events and Fests:** Open the Events page from the dashboard and review the sample listings. Select **Register Now** to open the form for an event.
4. **Event Registration:** Enter your name, email, and course/year and submit. The registration is saved in this browser.
5. **My Registrations:** Open this dashboard page to view the event registrations saved in the current browser.
6. **Clubs and Societies:** Select **Join Club** on a listed club. The confirmation and joined-club list are stored locally in the browser.
7. **Campus Communities:** Select **Join Community**. The page confirms the action and prevents joining the same listed community twice in that browser.
8. **Student Polls:** Select one option in each poll. Your choice is saved locally and shown on the page; the demo does not display combined results.
9. **Lost and Found:** Submit an item report with its type, description, location, and contact details. Review or delete reports in the recent-reports list.
10. **AI Campus Assistant:** Select **AI Assistant** or use the floating **Ask CampusVerse** button. Enter a question or choose a suggested prompt. A valid `OPENAI_API_KEY`, an active server, and internet access are required for responses. The assistant is intended to answer about the CampusVerse features and facts configured in `server.py`.

## Screenshots

Add real screenshots to a `screenshots/` directory and replace these placeholders with captured images:

| Page | Screenshot |
|---|---|
| Home | `![CampusVerse home page](screenshots/home.png)` |
| Dashboard | `![CampusVerse dashboard](screenshots/dashboard.png)` |
| Events and Fests | `![CampusVerse events page](screenshots/events.png)` |
| AI Assistant | `![CampusVerse AI assistant](screenshots/assistant.png)` |

The screenshot files are placeholders and are not currently included in the project.

## Future Scope

- Add a secure authentication system backed by a real user database.
- Store event registrations, club/community memberships, polls, and lost-and-found reports on a shared backend.
- Add role-based access and administrative tools for maintaining official campus information.
- Support aggregate poll results and moderation of user-submitted reports.
- Add verified event dates, venue information, and notifications when those data sources are available.
- Improve automated testing and deployment configuration before production use.

## Limitations

- The project has no database or shared server-side application data.
- Login and signup are demo forms; they do not create or validate accounts.
- Browser `localStorage` data belongs to the current browser profile and can be cleared or edited by its user.
- Polls display only the current browser's answer, not campus-wide results.
- Event listings and campus information are static examples; event dates are not announced in the current page.
- AI replies depend on an external OpenAI service, a valid API key, network connectivity, and applicable account access.
- The project has no production deployment configuration or automated test suite.

## Security Considerations

- Keep `OPENAI_API_KEY` on the server. Do not expose it in browser code, screenshots, public repositories, or shared terminals.
- The current `.gitignore` excludes `.env` files, but the server does not read them; configure environment variables through the server's environment.
- Avoid entering sensitive personal information in demo forms. Registration and contact details are stored in browser `localStorage`, not protected by an account system.
- Chat messages are sent by the server to OpenAI to generate responses. Do not submit confidential or sensitive information to the assistant.
- The server binds to `127.0.0.1` by default, which is intended for local use. It is a basic development server, not a production-hardened deployment; do not expose it publicly without adding appropriate authentication, access controls, rate limiting, and deployment security.

## Author Information

- **Name:** `[Your Name]`
- **Institution:** `[Your College or University]`
- **Department / Course:** `[Your Department or Course]`
- **Email:** `[Your Contact Email]`
- **GitHub:** `[Your GitHub Profile URL]`

Replace these placeholders with your preferred public author details.

## Conclusion

CampusVerse is a beginner-friendly demonstration of a unified campus website, combining a responsive browser interface with practical student-focused modules and an optional AI assistant. Its current client-side storage and demo authentication make it suitable for learning and presentation; a real campus deployment would require secure identity management, a persistent backend, and maintained campus data.
