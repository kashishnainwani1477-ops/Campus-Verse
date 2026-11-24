document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chatMessages");
    const userMessage = document.getElementById("userMessage");

    if (!chatMessages || !userMessage) {
        return;
    }

    const conversation = [];
    const sendButton = document.querySelector("#page-assistant button[onclick='sendMessage()']");

    function addMessage(sender, text) {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = sender + ": ";
        paragraph.appendChild(strong);
        paragraph.appendChild(document.createTextNode(text));
        chatMessages.appendChild(paragraph);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return paragraph;
    }

    window.sendMessage = async function () {
        const message = userMessage.value.trim();

        if (!message) {
            userMessage.focus();
            return;
        }

        addMessage("You", message);
        userMessage.value = "";
        userMessage.disabled = true;
        if (sendButton) {
            sendButton.disabled = true;
        }

        const pendingMessage = addMessage("Assistant", "Thinking...");
        const messages = conversation.concat({ role: "user", content: message });

        try {
            if (typeof window.askCampusAI !== "function") {
                throw new Error("The AI chat client is not ready. Please reload the page.");
            }

            const reply = await window.askCampusAI(messages.slice(-20));
            pendingMessage.remove();
            addMessage("Assistant", reply);
            conversation.push(
                { role: "user", content: message },
                { role: "assistant", content: reply }
            );
            if (conversation.length > 20) {
                conversation.splice(0, conversation.length - 20);
            }
        } catch (error) {
            pendingMessage.remove();
            const errorMessage = error instanceof TypeError
                ? "I couldn't connect to CampusVerse's server. Please make sure it's running and try again."
                : error.message || "Sorry, I couldn't reach the AI service. Please try again.";
            addMessage("Assistant", errorMessage);
        } finally {
            userMessage.disabled = false;
            if (sendButton) {
                sendButton.disabled = false;
            }
            userMessage.focus();
        }
    };

    window.askQuestion = function (question) {
        userMessage.value = question;
        window.sendMessage();
    };

    window.clearChat = function () {
        conversation.length = 0;
        chatMessages.replaceChildren();
        addMessage("Assistant", "Hi! Welcome to CampusVerse 👋 How can I help you today?");
    };

    userMessage.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            window.sendMessage();
        }
    });
});
