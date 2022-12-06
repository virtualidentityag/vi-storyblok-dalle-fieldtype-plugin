import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  
});

export const openai = new OpenAIApi(configuration);

// const completion = await openai.createCompletion({
//   model: "text-davinci-002",
//   prompt: "Hello world",
// });
// console.log(completion.data.choices[0].text);