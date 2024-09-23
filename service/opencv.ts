import { Mat } from "@techstark/opencv-js";
import cv from "@techstark/opencv-js";

// function ResizeImages(image: any, scale_percent: number){
//     let width = Number(image.shape[1] * scale_percent / 100)
//     let height = Number(image.shape[0] * scale_percent / 100)
//     let new_size: Mat = [width, height]
//     let resized_image = cv.resize(image, new_size, cv.INTER_AREA)
//     return resized_image;
// }
    
const mean = (array = []) => array.reduce((acc, x) => acc + x, 0) / array.length;

function variance(array: any) {
    const m = mean(array);
    return array.reduce((acc: any, el: any) => acc + Math.pow(el - m, 2), 0) / array.length;
  }

export function processPic(pic: any) {
    let matSize = pic.matSize;
    console.log('pic', pic);
    let src = new cv.Mat(matSize[0], matSize[1], cv.CV_8UC4);
    let gray_src = new cv.Mat(matSize[0], matSize[1], cv.CV_8UC1);
    let lap_gray = new cv.Mat(matSize[0], matSize[1], cv.CV_8UC1);
    let dst = new cv.Mat(matSize[0], matSize[1], cv.CV_8UC1);
    // let cap = new cv.VideoCapture(video);
    console.log(gray_src, 'gray_src');
  
    // process src -> dst
    cv.cvtColor(src, gray_src, cv.COLOR_RGBA2GRAY);
    cv.Laplacian(gray_src, lap_gray, -1);
    const focusMeasure = Math.floor(variance(lap_gray.data));

    console.log(`Focus Score: ${focusMeasure}`);
  }