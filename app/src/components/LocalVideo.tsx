import React, { useEffect, useRef, useState } from 'react';
import {
  FilesetResolver,
  ImageSegmenter,
  ImageSegmenterResult,
} from '@mediapipe/tasks-vision';

let imageSegmenter: ImageSegmenter;

export function LocalVideo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createImageSegmenter = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
          delegate: 'GPU',
        },
        outputCategoryMask: true,
        outputConfidenceMasks: false,
        runningMode: 'VIDEO',
      });

      setLoading(false);
    };

    createImageSegmenter();
  }, [setLoading]);

  useEffect(() => {
    const video = document.getElementById('local-video') as HTMLVideoElement;

    const canvas = document.getElementById('local-canvas') as HTMLCanvasElement;

    const canvasCtx = canvas.getContext('2d');

    if (!canvasCtx || !imageSegmenter) {
      return;
    }

    let lastWebcamTime = 0;

    if (!video || loading) {
      return;
    }

    canvasCtx.drawImage(video, 0, 0, video.width, video.height);

    const startTimeMs = performance.now();

    function callbackForVideo(result: ImageSegmenterResult) {
      let imageData = canvasCtx.getImageData(
        0,
        0,
        video.videoWidth,
        video.videoHeight
      ).data;

      const mask: Number[] = result.categoryMask.getAsFloat32Array();

      let j = 0;
      for (let i = 0; i < mask.length; ++i) {
        const maskVal = mask[i];

        if (maskVal < 0.5) {
          imageData[j + 3] = imageData[j + 3] * (1 - maskVal);
        } else {
          imageData[j] = 0;
          imageData[j + 1] = 0;
          imageData[j + 2] = 0;
          imageData[j + 3] = 255;
        }
        j += 4;
      }
      const uint8Array = new Uint8ClampedArray(imageData.buffer);
      const dataNew = new ImageData(
        uint8Array,
        video.videoWidth,
        video.videoHeight
      );

      canvasCtx.putImageData(dataNew, 0, 0);

      window.requestAnimationFrame(prepareVideo);
    }

    function prepareVideo() {
      if (video.currentTime === lastWebcamTime) {
        window.requestAnimationFrame(prepareVideo);

        return;
      }

      lastWebcamTime = video.currentTime;

      canvasCtx.drawImage(video, 0, 0);

      if (imageSegmenter === undefined) {
        return;
      }

      let startTimeMs = performance.now();

      // Start segmenting the stream.
      imageSegmenter.segmentForVideo(video, startTimeMs, callbackForVideo);
    }

    const enableCamera = async () => {
      if (!video) {
        return;
      }

      video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.addEventListener('loadeddata', prepareVideo);
    };

    enableCamera();
  }, [loading]);

  return (
    <div>
      <video id="local-video" autoPlay />
      <canvas id="local-canvas" width="1280px" height="720px"></canvas>
    </div>
  );
}
