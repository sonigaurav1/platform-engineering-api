import OpenAI from 'openai';

export const openAiClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});
