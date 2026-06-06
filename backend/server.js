import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("🚀 Angel AI Backend Running");
});

app.post("/chat", async (req, res) => {

    try {

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: req.body.message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(JSON.stringify(data, null, 2));

        res.json({
            reply: data.choices?.[0]?.message?.content || "No response"
        });

    } catch (error) {

        console.error(error);

        res.json({
            reply: "Server Error"
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
