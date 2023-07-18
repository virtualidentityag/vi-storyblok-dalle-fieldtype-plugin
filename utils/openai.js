import { Configuration, OpenAIApi } from "openai";


export const openai = (apiKey, orgId) => {
  const configuration = new Configuration({
    organization: orgId,
    apiKey: apiKey,
  });
  return new OpenAIApi(configuration);
}
