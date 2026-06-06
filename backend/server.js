import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const data = await response.json();

console.log("OPENAI RESPONSE:");
console.log(JSON.stringify(data, null, 2));


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Chat endpoint
app.post("/chat", async (req, res) => {

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
          { role: "user", content: req.body.message }
        ]
      })
    }
  );

  const data = await response.json();

  console.log(JSON.stringify(data, null, 2));

  res.json({
    reply: data.choices?.[0]?.message?.content || "No response"
  });
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "❌ Server error"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Angel AI running on port ${PORT}`);
});
