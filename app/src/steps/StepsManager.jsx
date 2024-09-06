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

let timeout;

export const StepsManager = forwardRef(
  ({ currentState, onPlaying, onConfirm: _onConfirm, onMove }, videoRef) => {
    const isDev = window.location.pathname.includes('dev');

    const onConfirm = (dev) => () => {
      if (dev && isDev) {
        _onConfirm();
      }

      if (!dev) {
        _onConfirm();
      }
    };

    const canShow = (step) => {
      if (!states[currentState]) {
        return;
      }

      return (
        states[currentState].name === step || states[currentState].next === step
      );
    };

    const handleStart = () => {
      timeout = setTimeout(() => {
        onConfirm(false)();
      }, 3000);
    };

    const handleStop = () => {
      clearTimeout(timeout);
    };

    return (
      <>
        <VideoTemplate
          state="ESPERA_LOOP"
          onPointerDown={handleStart}
          onPointerUp={handleStop}
          onPlaying={onPlaying}
          src="1-inicio.mp4"
          muted
          loop
          hidden={currentState !== 'ESPERA_LOOP'}
        />
        <VideoTemplate
          state="EXPLICACION"
          onEnded={onConfirm(false)}
          onClick={onConfirm(true)}
          onPlaying={onPlaying}
          muted
          src="2-explicacion.mp4"
          hidden={
            currentState !== 'EXPLICACION' &&
            currentState !== 'ESPERA_BOTON_INICIO'
          }
        />
        {currentState === 'ESPERA_BOTON_INICIO' && (
          <Modal onClick={onConfirm(false)} />
        )}
        <VideoTemplate
          state="TUTORIAL"
          muted
          onClick={onConfirm(true)}
          onEnded={onConfirm(false)}
          onPlaying={onPlaying}
          src="3-tutorial.mp4"
          hidden={currentState !== 'TUTORIAL'}
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute w-full h-full bg-black object-cover top-0 left-0"
          onPlaying={onPlaying}
          hidden={
            currentState !== 'MOVIMIENTO_EXCAVADORA' &&
            currentState !== 'MOVIMIENTO_EXCAVADORA_FINAL'
          }
        ></video>
        {(currentState === 'MOVIMIENTO_EXCAVADORA_FINAL' ||
          currentState === 'MOVIMIENTO_EXCAVADORA' ||
          currentState === 'TERMINADO') && (
          <Controls
            onMove={onMove}
            showTuto={currentState === 'MOVIMIENTO_EXCAVADORA'}
          />
        )}
        {currentState === 'TERMINADO' && (
          <img
            src="/assets/backgrounds/carga_exitosa.png"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-auto"
          />
        )}
        <VideoTemplate
          state="CIBER_ATAQUE"
          onEnded={onConfirm(false)}
          onClick={onConfirm(true)}
          muted
          src="4-cyber-ataque.mp4"
          onPlaying={onPlaying}
          hidden={currentState !== 'CIBER_ATAQUE'}
        />
        <VideoTemplate
          state="ESPERA_ACTIVAR_LIMPIEZA"
          onClick={onConfirm(false)}
          muted
          loop
          src="5-espera-analizar.mp4"
          onPlaying={onPlaying}
          hidden={currentState !== 'ESPERA_ACTIVAR_LIMPIEZA'}
        />
        <VideoTemplate
          state="LIMPIEZA"
          muted
          onClick={onConfirm(true)}
          onEnded={onConfirm(false)}
          src="6-analizando.mp4"
          onPlaying={onPlaying}
          hidden={currentState !== 'LIMPIEZA'}
        />
        <VideoTemplate
          state="ESPERA_RETOMAR"
          muted
          onClick={onConfirm(false)}
          loop
          src="7-espera-retomar.mp4"
          onPlaying={onPlaying}
          hidden={currentState !== 'ESPERA_RETOMAR'}
        />
        <VideoTemplate
          state="AGRADECIMIENTO"
          muted
          onEnded={onConfirm(false)}
          onClick={onConfirm(true)}
          src="8-agradecimiento.mp4"
          onPlaying={onPlaying}
          hidden={currentState !== 'AGRADECIMIENTO'}
        />
      </>
    );
  }
);
