import React from 'react';
import { Loading } from './Loading';

export function ScreenLoading({ text }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center text-3xl font-bold text-white">
      <Loading text={text} />
    </div>
  );
}
