import React, { useRef, useEffect, useState, forwardRef } from 'react';
import Webcam from 'react-webcam';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import * as cam from '@mediapipe/camera_utils';
import { Skeleton } from './Skeleton';
import cn from 'classnames';

const imagesUrl = [
  '/assets/backgrounds/0.jpg',
  '/assets/backgrounds/1.jpg',
  '/assets/backgrounds/2.jpg',
  '/assets/backgrounds/3.jpg',
];

export const LocalVideo2 = forwardRef(
  ({ selectBackground, onConfirm, topLeft }, canvasRef) => {
    const webcamRef = useRef(null);

    const [imageURL, setimageURL] = useState(imagesUrl[0]);

    const [loading, setLoading] = useState(true);

    const imgRef = useRef(null);

    const onResults = async (results) => {
      if (loading) {
        setLoading(false);
      }

      const img = imgRef.current;

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = 'destination-atop';
      canvasCtx.drawImage(
        results.segmentationMask,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Only overwrite missing pixels.

      canvasCtx.globalCompositeOperation = 'destination-over';
      canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.restore();
    };

    useEffect(() => {
      const selfieSegmentation = new SelfieSegmentation({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
        },
      });

      selfieSegmentation.setOptions({
        modelSelection: 1,
      });

      selfieSegmentation.onResults(onResults);

      if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null
      ) {
        const camera = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            await selfieSegmentation.send({ image: webcamRef.current.video });
          },
          width: 1280,
          height: 720,
        });

        camera.start();
      }
    }, []);

    const imageHandler = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setimageURL(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    return (
      <>
        <div className="">
          <div
            className={cn(
              'fixed w-full h-full top-0 left-0 bg-black transition-opacity',
              !selectBackground && 'opacity-0 select-none pointer-events-none'
            )}
          >
            <h2 className="absolute text-white font-bold text-6xl w-full pt-12 px-12 text-center">
              Elige desde qué lugar tomarás el control de forma remota.
            </h2>
            <img
              src="/assets/backgrounds/video_control.png"
              className="absolute bottom-[40px] left-1/2 -translate-x-1/2 h-[50px]"
            />
            <div className="flex justify-end w-full h-full p-12 pt-[80px] items-center mt-8">
              <div className="flex flex-col justify-center items-center gap-8">
                <div className="grid grid-cols-2 gap-6">
                  {imagesUrl.map((url, index) => (
                    <div
                      key={index}
                      className={cn(
                        'w-[170px] h-[170px] rounded-3xl overflow-hidden shadow-md',
                        url === imageURL &&
                          'outline outline-3 outline-green-500'
                      )}
                      onClick={() => setimageURL(url)}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={url}
                        alt={'background' + index}
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="p-4 w-full rounded-full text-[#d92723] bg-white font-bold text-3xl text-center"
                  onClick={onConfirm}
                >
                  ACEPTAR
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'fixed top-[40px] left-[40px] z-10 overflow-hidden rounded-xl bg-black transition-all',
              selectBackground &&
                'translate-x-[0px] translate-y-[190px] w-[600px] h-[400px]',
              !selectBackground && 'w-[220px] h-[150px]'
            )}
          >
            {loading && (
              <Skeleton className="absolute top-0 left-0 w-full h-full" />
            )}
            <div
              className="w-full h-full transition-opacity duration-700"
              style={{ opacity: loading ? 0 : 1 }}
            >
              <div className="w-full h-full">
                <Webcam
                  ref={webcamRef}
                  muted
                  autoPlay
                  style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    transform: 'scaleX(-1)',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="object-cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: 'scaleX(-1)',
                  }}
                ></canvas>
              </div>
            </div>
          </div>

          <div className="backgroundContainer">
            <div className="backgrounds">
              <img
                ref={imgRef}
                hidden
                src={imageURL}
                alt="The Screan"
                className="background"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);
