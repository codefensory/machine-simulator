import React from 'react';

export function Modal({ onClick }) {
  return (
    <div
      className="w-[560px] h-[338px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center px-24"
      style={{
        backgroundImage: 'url(/assets/backgrounds/modal-background.png',
      }}
    >
      <p className="text-white text-5xl font-bold mt-12">
        ACEPTO TOMAR EL CONTROL
      </p>
      <div className="w-full flex justify-end">
        <button
          className="text-3xl font-bold text-[#f60018] rounded-full mt-8 pt-4 pb-3 px-12 bg-white animate-osile leading-1"
          onClick={onClick}
        >
          ACEPTAR
        </button>
      </div>
    </div>
  );
}
