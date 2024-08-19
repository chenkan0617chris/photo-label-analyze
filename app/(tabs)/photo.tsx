import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { StyleSheet, Image } from 'react-native';
import { createWorker } from "tesseract.js";
import query from "../../service/openAI";
import { ChatCompletionMessage } from "openai/resources";


const photoPage = () => {

    const img_url = '../../dataset/3.png';

    const [text, setText] = useState<string>('');

    const [result, setResult] = useState<ChatCompletionMessage>();

    useEffect(() => {
        (async() => {
            const recognize = async (image: string, lang: string = 'eng') =>{

                const worker = await createWorker(lang);
            
                const data = await worker.recognize(image);
                
                await worker.terminate();
    
                return data?.data.text;
            };
            const text = await recognize(img_url);
            setText(text);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if(text){
                console.log(text);
                const res = await query(text);
                setResult(res);
    
                console.log(res);
            }
        })();
        
    }, [text]);


    return <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image
                source={require(img_url)}
            />}>
            <ThemedText>
                {result?.content}
            </ThemedText>
    </ParallaxScrollView>  
};

export default photoPage;

const styles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
  });