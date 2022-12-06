import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization:'org-qSTMZ6ASi3galKZXgZFNPuUi',
  apiKey: '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',
});

export const openai = new OpenAIApi(configuration);

// const completion = await openai.createCompletion({
//   model: "text-davinci-002",
//   prompt: "Hello world",
// });
// console.log(completion.data.choices[0].text);