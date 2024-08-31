import React, { useEffect, useState, forwardRef, useRef } from 'react';
import Webcam from 'react-webcam';
import { useSocket } from '../providers/socket';
import { states } from '../utils/constants';
import { VideoTemplate } from './VideoTemplate';

export const StepsManagerVW = forwardRef(({ onChangeState }, videoRef) => {
  const socket = useSocket();

  const [currentStep, setCurrentStep] = useState(states.ESPERA_LOOP.name);

  const canShow = (step) => {
    return (
      states[currentStep].name === step || states[currentStep].next === step
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

  console.log(currentStep);

  return (
    <>
      {canShow('ESPERA_LOOP') && (
        <VideoTemplate
          src="1-inicio-4k.mp4"
          loop
          autoPlay
          hidden={currentStep !== 'ESPERA_LOOP'}
        />
      )}
      {(currentStep === 'ESPERA_LOOP' ||
        currentStep === 'EXPLICACION' ||
        currentStep === 'ESPERA_BOTON_INICIO') && (
        <VideoTemplate
          src="2-explicacion-4k.mp4"
          autoPlay
          hidden={
            currentStep !== 'EXPLICACION' &&
            currentStep !== 'ESPERA_BOTON_INICIO'
          }
        />
      )}
      {(currentStep === 'ESPERA_BOTON_INICIO' ||
        currentStep === 'ELEGIR_FONDO' ||
        currentStep === 'TUTORIAL') && (
        <VideoTemplate
          src="3-tutorial-4k.mp4"
          autoPlay
          hidden={currentStep !== 'TUTORIAL'}
        />
      )}
      <Webcam
        ref={videoRef}
        className="absolute w-full h-full bg-black object-cover top-0 left-0"
        hidden={
          currentStep !== 'MOVIMIENTO_EXCAVADORA' &&
          currentStep !== 'MOVIMIENTO_EXCAVADORA_FINAL'
        }
      />
      {(currentStep === 'MOVIMIENTO_EXCAVADORA' ||
        currentStep === 'CIBER_ATAQUE' ||
        currentStep === 'ESPERA_ACTIVAR_LIMPIEZA') && (
        <VideoTemplate
          src="4-cyber-ataque-4k.mp4"
          autoPlay
          hidden={
            currentStep !== 'CIBER_ATAQUE' &&
            currentStep !== 'ESPERA_ACTIVAR_LIMPIEZA'
          }
        />
      )}
      {(currentStep === 'CIBER_ATAQUE' ||
        currentStep === 'ESPERA_ACTIVAR_LIMPIEZA' ||
        currentStep === 'LIMPIEZA' ||
        currentStep === 'ESPERA_RETOMAR') && (
        <VideoTemplate
          src="6-analizando-4k.mp4"
          autoPlay
          hidden={
            currentStep !== 'LIMPIEZA' && currentStep !== 'ESPERA_RETOMAR'
          }
        />
      )}
      {(currentStep === 'MOVIMIENTO_EXCAVADORA_FINAL' ||
        currentStep === 'TERMINADO' ||
        currentStep === 'AGRADECIMIENTO') && (
        <VideoTemplate
          src="8-agradecimiento-4k.mp4"
          autoPlay
          hidden={currentStep !== 'AGRADECIMIENTO'}
        />
      )}
    </>
  );
});
