document.addEventListener("DOMContentLoaded", function () {
    const launcher = document.getElementById("campusChatLauncher");
    const panel = document.getElementById("campusChatPanel");
    const closeButton = document.getElementById("campusChatClose");
    const messages = document.getElementById("campusChatMessages");
    const form = document.getElementById("campusChatForm");
    const input = document.getElementById("campusChatInput");

    if (!launcher || !panel || !closeButton || !messages || !form || !input) {
        console.error("CampusVerse chat could not start because its interface is incomplete.");
        return;
    }

    const conversation = [];
    const sendButton = form.querySelector("button[type='submit']");

    function addMessage(text, isUser) {
        const message = document.createElement("div");
        message.className = "campus-chat-message" + (isUser ? " is-user" : "");
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    }

    window.askCampusAI = async function (chatHistory) {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory })
        });

        let result;
        try {
            result = await response.json();
        } catch (error) {
            throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
            throw new Error(result.error || "The AI service is unavailable.");
        }

        if (typeof result.reply !== "string" || !result.reply.trim()) {
            throw new Error("The AI service returned an empty response.");
        }

        return result.reply.trim();
    };

    function closeChat() {
        panel.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
    }

    window.openCampusChat = function () {
        panel.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        input.focus();
    };

    launcher.addEventListener("click", function () {
        if (panel.hidden) {
            window.openCampusChat();
        } else {
            closeChat();
        }
    });

    closeButton.addEventListener("click", closeChat);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !panel.hidden) {
            closeChat();
            launcher.focus();
        }
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const question = input.value.trim();

        if (!question) {
            input.focus();
            return;
        }

        addMessage(question, true);
        input.value = "";
        input.disabled = true;
        sendButton.disabled = true;
        const thinkingMessage = addMessage("Thinking...", false);
        const messagesToSend = conversation.concat({ role: "user", content: question });

        try {
            const reply = await window.askCampusAI(messagesToSend.slice(-20));
            thinkingMessage.remove();
            addMessage(reply, false);
            conversation.push(
                { role: "user", content: question },
                { role: "assistant", content: reply }
            );
            if (conversation.length > 20) {
                conversation.splice(0, conversation.length - 20);
            }
        } catch (error) {
            thinkingMessage.remove();
            const errorMessage = error instanceof TypeError
                ? "I couldn't connect to CampusVerse's server. Please make sure it's running and try again."
                : error.message || "Sorry, I couldn't reach the AI service. Please try again.";
            addMessage(errorMessage, false);
        } finally {
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    });

    document.querySelectorAll("[data-chat-question]").forEach(function (button) {
        button.addEventListener("click", function () {
            if (input.disabled) {
                return;
            }
            input.value = button.getAttribute("data-chat-question") || "";
            form.requestSubmit();
        });
    });

    addMessage("Hi! Welcome to CampusVerse 👋 How can I help you today?", false);
});
