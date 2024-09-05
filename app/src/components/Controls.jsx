import React, { useRef, useState, useEffect } from 'react';

function ButtonArrow({ className, ...rest }) {
  return (
    <svg
      width="209"
      height="204"
      viewBox="0 0 209 204"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path
        d="M0 35.96L0 167.89C0 187.75 16.0998 203.85 35.96 203.85H173.03C192.89 203.85 208.99 187.75 208.99 167.89V35.96C208.99 16.0999 192.89 1.52588e-05 173.03 1.52588e-05H35.96C16.0998 1.52588e-05 0 16.0999 0 35.96Z"
        fill="#F2F2F2"
      />
      <path
        d="M48.3501 110.48L127.96 167.52C134.92 172.51 144.61 167.53 144.61 158.97V44.89C144.61 36.32 134.92 31.35 127.96 36.34L48.3501 93.38C42.4901 97.58 42.4901 106.29 48.3501 110.49V110.48Z"
        fill="black"
      />
    </svg>
  );
}

export function Controls({ onMove, showTuto }) {
  const vertical = useRef('');

  const horizontal = useRef('');

  const [showingTutorial, setShowingTutorial] = useState(true);

  const handleVerticalDown = (key) => {
    vertical.current = key;

    onMove(key);
  };

  const handleVerticalUp = (key) => {
    if (vertical.current === key) {
      vertical.current = '';

      onMove('m');

      return;
    }
  };

  const handleHorizontalDown = (key) => {
    horizontal.current = key;

    onMove(key);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowingTutorial(false);
    }, 7000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleHorizontalUp = (key) => {
    if (horizontal.current === key) {
      horizontal.current = '';

      onMove('r');

      return;
    }
  };

  return (
    <div className="relative">
      {showingTutorial && showTuto && (
        <img
          src="/assets/backgrounds/tutorial_maquina.png"
          className="fixed top-0 left-0 w-full h-full object-cover"
        />
      )}
      <div className="fixed w-full h-full top-0 left-0 flex justify-between items-end p-8">
        <div className="flex gap-12">
          <ButtonArrow
            className="left w-[150px] h-[150px]"
            onContextMenuCapture={(e) => e.preventDefault()}
            onTouchStart={() => handleHorizontalDown('a')}
            onTouchEnd={() => handleHorizontalUp('a')}
          />
          <ButtonArrow
            className="right w-[150px] h-[150px] -scale-x-[1]"
            onContextMenuCapture={(e) => e.preventDefault()}
            onTouchStart={() => handleHorizontalDown('d')}
            onTouchEnd={() => handleHorizontalUp('d')}
          />
        </div>
        <div className="flex flex-col gap-12">
          <ButtonArrow
            className="up w-[150px] h-[150px] rotate-90"
            onContextMenuCapture={(e) => e.preventDefault()}
            onTouchStart={() => handleVerticalDown('w')}
            onTouchEnd={() => handleVerticalUp('w')}
          />
          <ButtonArrow
            className="down w-[150px] h-[150px] -rotate-90"
            onContextMenuCapture={(e) => e.preventDefault()}
            onTouchStart={() => handleVerticalDown('s')}
            onTouchEnd={() => handleVerticalUp('s')}
          />
        </div>
      </div>
    </div>
  );
}
