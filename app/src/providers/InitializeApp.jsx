import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import { Loading } from '../components/Loading';
import { preloadingAtom, stateAtom } from '../store/stateAtom';
import { states } from '../utils/constants';

const InitializeContext = createContext();

export const InitializeAppProvider = ({ children }) => {
  const preloading = useAtomValue(preloadingAtom);

  const [loadingCamera, setLoadingCamera] = useState(true);

  const [state, setState] = useAtom(stateAtom);

  useEffect(() => {
    const initializeMedia = async () => {
      await navigator.mediaDevices.getUserMedia({ video: true });

      setLoadingCamera(false);
    };

    initializeMedia();
  }, []);

  useEffect(() => {
    if (preloading) {
      return;
    }

    setState(states.ESPERA_LOOP.name);
  }, [preloading]);

  if (loadingCamera) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center text-3xl font-bold text-white">
        <Loading text="Esperando confirmacion de camara" />
      </div>
    );
  }

  return (
    <InitializeContext.Provider value={{}}>
      <>
        <div
          style={{
            pointerEvents: state !== '' ? 'auto' : 'none',
          }}
        >
          {children}
        </div>
        {preloading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center text-3xl font-bold text-white">
            <Loading text="Cargando videos" />
          </div>
        )}
      </>
    </InitializeContext.Provider>
  );
};
