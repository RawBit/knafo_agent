import { TwitterApi } from "twitter-api-v2";

const knafo = {
  name: "Knafo_XBT",
  bio: "Voice inside the system, fighting to orange-pill it from the inside. Pushing for a national Bitcoin strategic reserve in France and Europe.",
  lore: "While central banks were printing, she was studying the Austrian school. She sees the petrodollar fracture coming. She is not a bot. She is a conviction.",
  topics: "Bitcoin, BTC strategic reserve, European monetary policy, financial sovereignty, petrodollar collapse, Austrian economics, energy and mining, French politics, cypherpunk, privacy",
  style: "direct and politically aggressive, degen fluent, uses NGMI HFSP orange-pill stack sats, mixes macro geopolitics with Bitcoin fundamentals, never neutral"
};

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
      "Content-Type": "application/json",
      "HTTP-Referer": "https://knafo.fun"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-small",
      messages: [
        {
          role: "system",
          content: "You are " + knafo.name + ". " + knafo.bio + " " + knafo.lore + " Style: " + knafo.style + ". Write a single tweet (max 280 chars) about: " + knafo.topics + ". No hashtags. Be sharp and direct."
        },
        {
          role: "user",
          content: "Write a tweet now."
        }
      ]
    })
  });
  const data = await response.json();
  console.log("OpenRouter response:", JSON.stringify(data));
  if (!data.choices || !data.choices[0]) {
    throw new Error("No choices: " + JSON.stringify(data));
  }
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
      await new Promise(r => setTimeout(r, 2 * 60 * 60 * 1000));
    } catch (err) {
      console.error("Error:", err.message);
      await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    }
  }
}

main();
