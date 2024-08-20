// import dotenv from "dotenv";
// dotenv.config();

import OpenAI from "openai";

// console.log(process.env.OPEN_ROUTER_API_KEY);
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export default openrouter;
