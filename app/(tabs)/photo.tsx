import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { recognize } from "@/service/main";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { StyleSheet, Image, Platform } from 'react-native';
import { createWorker } from "tesseract.js";


const photoPage = () => {

    const img_url = '../../dataset/3.png';

    const [text, setText] = useState<string>('');

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


    return <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image
                source={require(img_url)}
            />}>
            <ThemedText>
                {text}
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