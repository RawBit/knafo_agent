import { TwitterApi } from "twitter-api-v2";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const knafo = require("../characters/knafo_xbt.character.json");

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function generateTweet() {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: `You are ${knafo.name}. ${knafo.bio.join(" ")} ${knafo.lore.join(" ")} Style: ${knafo.style.all.join(", ")}. Write a tweet (max 280 chars) about one of these topics: ${knafo.topics.join(", ")}. No hashtags. Be sharp and direct.`
        },
        { role: "user", content: "Write a tweet now." }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function main() {
  console.log("Knafo_XBT starting... 🐾");
  while (true) {
    try {
      const tweet = await generateTweet();
      console.log("Posting:", tweet);
      if (process.env.TWITTER_DRY_RUN !== "true") {
        await client.v2.tweet(tweet);
      }
      // Wait 2 hours between tweets
      await new Promise(r => setTimeout(r, 2 * 60 * 60 * 1000));
    } catch (err) {
      console.error("Error:", err.message);
      await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    }
  }
}

main();
