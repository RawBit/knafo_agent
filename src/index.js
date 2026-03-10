import { AgentRuntime } from "@elizaos/core";
import { TwitterClientInterface } from "@elizaos/plugin-twitter";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const knafo = require("../characters/knafo_xbt.character.json");

const runtime = new AgentRuntime({
  character: knafo,
  token: process.env.OPENROUTER_API_KEY,
  modelProvider: "openrouter",
});

const twitter = await TwitterClientInterface.start(runtime);
console.log("Knafo_XBT is live 🐾");
