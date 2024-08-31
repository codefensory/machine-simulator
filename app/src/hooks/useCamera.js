import { useEffect } from 'react';

export function useCamera({ onLoad }) {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(function success(stream) {
        onLoad(stream);
      });
  }, []);
}
