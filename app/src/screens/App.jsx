import cn from 'classnames';
import { useAtom, useSetAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { LocalVideo2 } from '../components/LocalVideo2';
import { useCameraConnection } from '../hooks/useCameraConnection2';
import { useSocket } from '../providers/socket';
import { StepsManager } from '../steps/StepsManager';
import { preloadingAtom, stateAtom } from '../store/stateAtom';
import { states } from '../utils/constants';

export function AppScreen() {
  const socket = useSocket();

  const { remoteRef, localRef } = useCameraConnection({
    captureStream: (ref) => {
      return ref.current.captureStream();
    },
  });

  const [currentState, setCurrentState] = useAtom(stateAtom);

  const setPreloading = useSetAtom(preloadingAtom);

  const canConfirm = useRef(true);

  useEffect(() => {
    socket.on('state', (state) => {
      setCurrentState(state);

      canConfirm.current = true;
    });

    return () => {
      socket.off('state');
    };
  }, [socket, setCurrentState]);

  useEffect(() => {
    const videos = document.querySelectorAll('.video');

    Promise.all(
      [...videos].map((video) => {
        return new Promise((resolve) => {
          if (!video.src) {
            console.log('video ignorado');

            resolve();

            return;
          }

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

  const handleConfirm = async () => {
    if (!canConfirm.current) {
      return;
    }

    canConfirm.current = false;

    socket.emit('confirm');
  };

  const handleNextState = async () => {
    if (!canConfirm.current) {
      return;
    }

    setCurrentState(states[currentState].next);
  };

  const handleMove = (key) => {
    console.log('move', key);

    socket.emit('move', key);
  };

  const hiddeCamera =
    currentState === states.ESPERA_LOOP.name ||
    currentState === states.EXPLICACION.name;

  return (
    <>
      <div
        className={cn(hiddeCamera && 'opacity-0', !hiddeCamera && 'opacity-1')}
      >
        <LocalVideo2
          ref={localRef}
          selectBackground={currentState === 'ELEGIR_FONDO'}
          onConfirm={handleConfirm}
        />
      </div>
      <StepsManager
        ref={remoteRef}
        currentState={currentState}
        onConfirm={handleConfirm}
        onNextState={handleNextState}
        onMove={handleMove}
      />
    </>
  );
}
