const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type);
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// ⚠️ IMPORTANT: make it global (fix send is not defined)
window.send = async function () {

    const text = input.value;
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
        const res = await fetch("/chat", {   // ✅ IMPORTANT (no full URL)
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await res.json();

        addMessage(data.reply, "bot");

    } catch (err) {
        console.error(err);
        addMessage("❌ Error connecting to Angel AI", "bot");
    }
};

console.log("script.js loaded ✅");
