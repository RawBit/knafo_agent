import { AgentRuntime, ModelProviderName } from "@elizaos/core";
import { TwitterClientInterface } from "@elizaos/plugin-twitter";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const knafo = require("../characters/knafo_xbt.character.json");

const runtime = new AgentRuntime({
  character: knafo,
  modelProvider: ModelProviderName.OPENROUTER,
  token: process.env.OPENROUTER_API_KEY,
});

const twitter = await TwitterClientInterface.start(runtime);
console.log("Knafo_XBT is live 🐾");
