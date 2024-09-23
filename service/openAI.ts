import { CHOICES } from "@/constants/constants";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources";
// import 'dotenv/config';


const query = async (question: string, choice: string):Promise<ChatCompletionMessage> => {

    let content = () => {
        switch(choice){
            // Ingredient
            case CHOICES[1]:
                return `find the Ingredient of this information below. Use a table to display. 
                Information: ${question}`;
            case CHOICES[2]:
                return `find the Nutrition of this information below. Use a table to display. 
                Information: ${question}`;
            case CHOICES[3]:
                return `find the Brand of this information. display it like "Brand: brandName". 
                Information: ${question}`;
            case CHOICES[4]:
                return `find the Logo of this information. display it like "Brand: brandName". 
                Information: ${question}`;
            default:
                return `give a summary of this information. Use a table to display. ${question}`;
        }
    };

    const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful character analyzer." },
            {
                role: "user",
                content: content()
            },
        ],
    });
    return completion.choices[0].message;
}

export default query;