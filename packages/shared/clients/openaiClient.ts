// import dotenv from "dotenv";
// dotenv.config();

import OpenAI from "openai";

// console.log(process.env.OPEN_ROUTER_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export default openai;
