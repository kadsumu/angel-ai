const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type);
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function send() {

    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {

        const res = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await res.json();

        addMessage(data.reply || "No reply received", "bot");

    } catch (err) {

        addMessage("❌ Error connecting to Angel AI", "bot");
        console.error(err);

    }
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        send();
    }
});