import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

export function VideoTemplate({
  onClick,
  onEnded,
  hidden,
  onPlaying,
  state,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const init = async () => {
      if (rest.autoPlay) {
        if (hidden) {
          ref.current.currentTime = 0;

          ref.current.pause();
        }

        return;
      }

      if (!hidden) {
        ref.current.addEventListener(
          'timeupdate',
          () => {
            onPlaying?.(state);
          },
          { once: true }
        );

        ref.current.play();
      } else if (!ref.current.paused) {
        ref.current.currentTime = 0;

        ref.current.pause();
      }
    };

    init();
  }, [hidden, ref]);

  return (
    <div
      className="fixed w-[100%] h-[100%] top-0 left-0 opacity-0 pointer-events-none select-none bg-black"
      onClick={onClick}
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      <video
        {...rest}
        ref={ref}
        state={state}
        preload={rest.autoPlay ? 'auto' : 'metadata'}
        autoPlay={rest.autoPlay && !hidden}
        className="video w-full h-full object-cover"
        onEnded={onEnded}
        src={'https://simulador.codefensory.com:6243/videos/' + rest.src}
      ></video>
    </div>
  );
}
