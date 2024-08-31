import React from 'react';
import Webcam from 'react-webcam';
import { useCameraConnection } from './hooks/useCameraConnection2';
import { StepsManagerVW } from './steps/StepsManagerVW';
import cn from 'classnames';

export function VW() {
  const { localRef, remoteRef } = useCameraConnection({
    captureStream: (ref) => {
      return ref.current.stream;
    },
  });

  const [selectBackground, setSelectBackground] = React.useState(false);

  const [isHome, setIsHome] = React.useState(true);

  const handleChangeState = (state) => {
    if (state === 'ESPERA_LOOP') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }

    if (state === 'ELEGIR_FONDO') {
      setSelectBackground(true);
    } else {
      setSelectBackground(false);
    }
  };

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-black flex">
      <StepsManagerVW ref={localRef} onChangeState={handleChangeState} />
      <video
        ref={remoteRef}
        autoPlay
        hidden={isHome}
        className={cn(
          'fixed z-10 overflow-hidden rounded-xl object-cover bg-black -scale-x-[1] transition-all duration-500',
          selectBackground && 'w-full h-full top-0 left-0',
          !selectBackground && 'w-[250px] h-[150px] top-[20px] left-[20px]'
        )}
      />
    </div>
  );
}
