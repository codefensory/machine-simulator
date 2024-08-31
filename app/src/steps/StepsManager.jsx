import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useRef,
} from 'react';
import { Controls } from '../components/Controls';
import { Modal } from '../components/Modal';
import { states } from '../utils/constants';
import { VideoTemplate } from './VideoTemplate';

export const StepsManager = forwardRef(
  ({ currentState, onNextState, onConfirm, onMove }, videoRef) => {
    const canShow = (step) => {
      if (!states[currentState]) {
        return;
      }

      return (
        states[currentState].name === step || states[currentState].next === step
      );
    };

    return (
      <>
        {(currentState === '' || canShow('ESPERA_LOOP')) && (
          <VideoTemplate
            onClick={onConfirm}
            src="1-inicio.mp4"
            muted
            loop
            hidden={currentState !== 'ESPERA_LOOP'}
          />
        )}
        <VideoTemplate
          onEnded={onConfirm}
          muted
          src="2-explicacion.mp4"
          hidden={
            currentState !== 'EXPLICACION' &&
            currentState !== 'ESPERA_BOTON_INICIO'
          }
        />
        {currentState === 'ESPERA_BOTON_INICIO' && (
          <Modal onClick={onConfirm} />
        )}
        {(currentState === '' || canShow('TUTORIAL')) && (
          <VideoTemplate
            muted
            onEnded={onConfirm}
            src="3-tutorial.mp4"
            hidden={currentState !== 'TUTORIAL'}
          />
        )}
        <video
          ref={videoRef}
          autoPlay
          className="absolute w-full h-full bg-black object-cover top-0 left-0"
          hidden={
            currentState !== 'MOVIMIENTO_EXCAVADORA' &&
            currentState !== 'MOVIMIENTO_EXCAVADORA_FINAL'
          }
        ></video>
        {(currentState === 'MOVIMIENTO_EXCAVADORA_FINAL' ||
          currentState === 'MOVIMIENTO_EXCAVADORA') && (
          <Controls onMove={onMove} />
        )}
        <VideoTemplate
          onEnded={onConfirm}
          muted
          src="4-cyber-ataque.mp4"
          hidden={currentState !== 'CIBER_ATAQUE'}
        />
        {(currentState === 'CIBER_ATAQUE' ||
          currentState === 'ESPERA_ACTIVAR_LIMPIEZA') && (
          <VideoTemplate
            onClick={onConfirm}
            muted
            loop
            src="5-espera-analizar.mp4"
            hidden={currentState !== 'ESPERA_ACTIVAR_LIMPIEZA'}
          />
        )}
        {(currentState === 'CIBER_ATAQUE' ||
          currentState === 'ESPERA_ACTIVAR_LIMPIEZA' ||
          currentState === 'LIMPIEZA') && (
          <VideoTemplate
            muted
            onEnded={onConfirm}
            src="6-analizando.mp4"
            hidden={currentState !== 'LIMPIEZA'}
          />
        )}
        {canShow('ESPERA_RETOMAR') && (
          <VideoTemplate
            muted
            onClick={onConfirm}
            loop
            src="7-espera-retomar.mp4"
            hidden={currentState !== 'ESPERA_RETOMAR'}
          />
        )}
        <VideoTemplate
          muted
          onEnded={onConfirm}
          src="8-agradecimiento.mp4"
          hidden={currentState !== 'AGRADECIMIENTO'}
        />
      </>
    );
  }
);
