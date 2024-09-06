import React, { useEffect, useState, forwardRef, useRef } from 'react';
import Webcam from 'react-webcam';
import { useSocket } from '../providers/socket';
import { states } from '../utils/constants';
import { VideoTemplate } from './VideoTemplate';

export const StepsManagerVW = forwardRef(({ onChangeState }, videoRef) => {
  const socket = useSocket();

  const videosRef = useRef({});

  const audioRef = useRef(null);

  const audioClickRef = useRef(null);

  const audioFinRef = useRef(null);

  const lastTimestamp = useRef(Date.now());

  const [currentState, setCurrentStep] = useState(states.ESPERA_LOOP.name);

  const canShow = (step) => {
    return (
      states[currentState].name === step || states[currentState].next === step
    );
  };

  useEffect(() => {
    socket.on('state', (state) => {
      onChangeState?.(state);

      setCurrentStep(state);

      if (state === states.MOVIMIENTO_EXCAVADORA.name) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }

      if (state === states.TERMINANDO.name) {
        audioFinRef.current.play();
      } else {
        audioFinRef.current.currentTime = 0;

        audioFinRef.current.pause();
      }

      if (
        [
          states.ELEGIR_FONDO.name,
          states.TUTORIAL.name,
          states.LIMPIEZA.name,
          states.MOVIMIENTO_EXCAVADORA_FINAL.name,
        ].includes(state)
      ) {
        audioClickRef.current.play();
      } else {
        audioClickRef.current.currentTime = 0;

        audioClickRef.current.pause();
      }
    });

    socket.on('play', ({ state, timestamp }) => {
      console.log('play', state);

      lastTimestamp.current = timestamp;

      videosRef.current[state]?.play();
    });

    socket.on('restart', () => {
      window.location.reload();
    });

    return () => {
      socket.off('state');

      socket.off('play');
    };
  }, [socket, setCurrentStep]);

  useEffect(() => {
    const videos = document.querySelectorAll('.video');

    for (const video of videos) {
      videosRef.current[video.getAttribute('state')] = video;

      video.addEventListener('timeupdate', () => {
        if (video.paused) {
          return;
        }

        const timeDiff =
          (socket.now() / 1000 - lastTimestamp.current / 1000) % video.duration;

        const timeRest = timeDiff - video.currentTime;

        video.playbackRate = Math.max(0.8, Math.min(1.2, 1 + timeRest));

        if (Math.abs(timeRest) > 0.1) {
          console.log(timeRest, video.currentTime);
        }
      });
    }
  }, []);

  const handleFinAudio = () => {
    socket.emit('confirm');
  };

  return (
    <>
      <VideoTemplate
        state="ESPERA_LOOP"
        src="1-inicio-4k.mp4"
        loop
        autoPlay
        hidden={currentState !== 'ESPERA_LOOP'}
      />
      <VideoTemplate
        state="EXPLICACION"
        src="2-explicacion-4k.mp4"
        autoPlay
        hidden={
          currentState !== 'EXPLICACION' &&
          currentState !== 'ESPERA_BOTON_INICIO'
        }
      />
      <VideoTemplate
        state="TUTORIAL"
        src="3-tutorial-4k.mp4"
        autoPlay
        hidden={currentState !== 'TUTORIAL'}
      />

      <audio ref={audioRef}>
        <source
          src="https://simulador.codefensory.com/assets/voz.mp3"
          type="audio/mpeg"
        ></source>
      </audio>

      <audio ref={audioClickRef}>
        <source
          src="https://simulador.codefensory.com/assets/click.mp3"
          type="audio/mpeg"
        ></source>
      </audio>

      <audio ref={audioFinRef} onEnded={handleFinAudio}>
        <source
          src="https://simulador.codefensory.com/assets/fin.mp3"
          type="audio/mpeg"
        ></source>
      </audio>

      <Webcam
        ref={videoRef}
        className="absolute w-full h-full bg-black object-cover top-0 left-0"
        hidden={
          currentState !== 'MOVIMIENTO_EXCAVADORA' &&
          currentState !== 'MOVIMIENTO_EXCAVADORA_FINAL' &&
          currentState !== 'TERMINANDO'
        }
      />
      {currentState === 'TERMINANDO' && (
        <img
          src="/assets/backgrounds/carga_exitosa.png"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-auto"
        />
      )}
      <VideoTemplate
        state="CIBER_ATAQUE"
        src="4-cyber-ataque-4k.mp4"
        autoPlay
        hidden={currentState !== 'CIBER_ATAQUE'}
      />
      <VideoTemplate
        state="ESPERA_ACTIVAR_LIMPIEZA"
        loop
        autoPlay
        src="5-espera-analizar-4k.mp4"
        hidden={currentState !== 'ESPERA_ACTIVAR_LIMPIEZA'}
      />
      <VideoTemplate
        state="LIMPIEZA"
        src="6-analizando-4k.mp4"
        autoPlay
        hidden={currentState !== 'LIMPIEZA'}
      />
      <VideoTemplate
        state="ESPERA_RETOMAR"
        loop
        src="7-espera-retomar-4k.mp4"
        autoPlay
        hidden={currentState !== 'ESPERA_RETOMAR'}
      />
      <VideoTemplate
        state="AGRADECIMIENTO"
        src="8-agradecimiento-4k.mp4"
        autoPlay
        hidden={currentState !== 'AGRADECIMIENTO'}
      />
    </>
  );
});
