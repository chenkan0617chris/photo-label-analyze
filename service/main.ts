import { createWorker } from "tesseract.js";

// export const start = async () => {
//     const worker = await createWorker(lang);
// };

export const recognize = async (image: string, lang: string = 'eng') =>{

    const worker = await createWorker(lang);

    const data = await worker.recognize(image);


    return data?.data.text;


    
    console.log(data);
    await worker.terminate();

};

// export const shutdown = async () => {
//     await worker.terminate();
// }