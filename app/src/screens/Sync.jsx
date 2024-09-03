import React from 'react';
import { useSocket } from '../providers/socket';
import { useEffect, useState, useRef } from 'react';
import { ScreenLoading } from '../components/ScreenLoading';

export function SyncScreen() {
  const socket = useSocket();

  const [counter, setCounter] = useState(0);

  const [preloading, setPreloading] = useState(true);

  const timestampRef = useRef(Date.now());

  const videoRef = useRef(null);

  useEffect(() => {
    socket.on('test', (timestamp) => {
      timestampRef.current = timestamp;

      videoRef.current.currentTime = socket.delay() / 1000;

      console.log(socket.delay());

      console.log('readyState', videoRef.current.readyState);

      if (videoRef.current.canplaythrough) {
        socket.emit('ready');

        return;
      }

      videoRef.current.addEventListener(
        'canplaythrough',
        () => {
          socket.emit('ready');
        },
        {
          once: true,
        }
      );
    });

    socket.on('play', (timestamp) => {
      videoRef.current.play();
    });

    return () => {
      socket.off('test');

      socket.off('play');
    };
  }, []);

  useEffect(() => {
    const videos = document.querySelectorAll('.video');

    Promise.all(
      [...videos].map((video) => {
        return new Promise((resolve) => {
          video.addEventListener(
            'canplaythrough',
            () => {
              console.log(`Video ${video.src} está completamente pre-cargado.`);

              resolve();
            },
            { once: true }
          );
        });
      })
    ).then(() => {
      setPreloading(false);
    });
  }, []);

  return (
    <>
      {preloading && <ScreenLoading text="Cargando videos" />}

      <div
        className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-end text-7xl font-bold text-white"
        style={{ opacity: preloading ? 0 : 1 }}
      >
        <video
          ref={videoRef}
          className="video w-full h-full"
          preload="auto"
          muted
        >
          <source src="https://simulador.codefensory.com:6243/videos/2-explicacion.mp4"></source>
        </video>
      </div>
    </>
  );
}
