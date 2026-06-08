require('dotenv').config();

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function main() {
  const response = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL,
    messages: [
      {
        role: "user",
        content: "Reply only with: Jarvis online"
      }
    ]
  });

  console.log(response.choices[0].message.content);
}

main().catch(console.error);
