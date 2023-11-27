import OpenAI from "openai";


export const openai = (apiKey, orgId) => {
  
  return new OpenAI({
    organization: orgId,
    apiKey: apiKey,
  });
}
