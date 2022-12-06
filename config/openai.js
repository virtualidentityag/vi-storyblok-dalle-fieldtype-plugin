import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.API_KEY,
});

export const openai = new OpenAIApi(configuration);
