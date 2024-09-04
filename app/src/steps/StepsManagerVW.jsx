import React, { useEffect, useState, forwardRef, useRef } from 'react';
import Webcam from 'react-webcam';
import { useSocket } from '../providers/socket';
import { states } from '../utils/constants';
import { VideoTemplate } from './VideoTemplate';

export const StepsManagerVW = forwardRef(({ onChangeState }, videoRef) => {
  const socket = useSocket();

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
    });

    return () => {
      socket.off('state');
    };
  }, [socket, setCurrentStep]);

  console.log(currentState);

  return (
    <>
      {canShow('ESPERA_LOOP') && (
        <VideoTemplate
          src="1-inicio-4k.mp4"
          loop
          autoPlay
          hidden={currentState !== 'ESPERA_LOOP'}
        />
      )}
      {(currentState === 'ESPERA_LOOP' ||
        currentState === 'EXPLICACION' ||
        currentState === 'ESPERA_BOTON_INICIO') && (
        <VideoTemplate
          src="2-explicacion-4k.mp4"
          autoPlay
          hidden={
            currentState !== 'EXPLICACION' &&
            currentState !== 'ESPERA_BOTON_INICIO'
          }
        />
      )}
      {(currentState === 'ESPERA_BOTON_INICIO' ||
        currentState === 'ELEGIR_FONDO' ||
        currentState === 'TUTORIAL') && (
        <VideoTemplate
          src="3-tutorial-4k.mp4"
          autoPlay
          hidden={currentState !== 'TUTORIAL'}
        />
      )}
      <Webcam
        ref={videoRef}
        className="absolute w-full h-full bg-black object-cover top-0 left-0"
        hidden={
          currentState !== 'MOVIMIENTO_EXCAVADORA' &&
          currentState !== 'MOVIMIENTO_EXCAVADORA_FINAL'
        }
      />
      {(currentState === 'MOVIMIENTO_EXCAVADORA' ||
        currentState === 'CIBER_ATAQUE' ||
        currentState === 'ESPERA_ACTIVAR_LIMPIEZA') && (
        <VideoTemplate
          src="4-cyber-ataque-4k.mp4"
          autoPlay
          hidden={
            currentState !== 'CIBER_ATAQUE' &&
            currentState !== 'ESPERA_ACTIVAR_LIMPIEZA'
          }
        />
      )}
      {(currentState === 'CIBER_ATAQUE' ||
        currentState === 'ESPERA_ACTIVAR_LIMPIEZA' ||
        currentState === 'LIMPIEZA' ||
        currentState === 'ESPERA_RETOMAR') && (
        <VideoTemplate
          src="6-analizando-4k.mp4"
          autoPlay
          hidden={
            currentState !== 'LIMPIEZA' && currentState !== 'ESPERA_RETOMAR'
          }
        />
      )}
      {(currentState === 'MOVIMIENTO_EXCAVADORA_FINAL' ||
        currentState === 'TERMINADO' ||
        currentState === 'AGRADECIMIENTO') && (
        <VideoTemplate
          src="8-agradecimiento-4k.mp4"
          autoPlay
          hidden={currentState !== 'AGRADECIMIENTO'}
        />
      )}
    </>
  );
});
