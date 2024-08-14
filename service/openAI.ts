import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources";
// import 'dotenv/config';


const query = async (question: string):Promise<ChatCompletionMessage> => {


    console.log('process.env.OPEN_AI_API_KEY', process.env.EXPO_PUBLIC_OPEN_AI_API_KEY)

    const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: `give a summary of this information. Use a table to display. ${question}`,
            },
        ],
    });
    return completion.choices[0].message;
}

export default query;