import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use(express.static("public"));
app.post("/chat", async (req, res) => {
    try {

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: req.body.message }
                ]
            })
        });

        const data = await response.json();

        console.log("OPENAI RESPONSE:", data);

        if (!data.choices || !data.choices[0]) {
            return res.json({
                reply: "AI error: no response from OpenAI"
            });
        }

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.json({
            reply: "Server Error: " + error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("🚀 Angel AI Backend Running");
});
