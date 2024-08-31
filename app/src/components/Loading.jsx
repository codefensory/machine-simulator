import React from 'react';
import './Loading.css';

export function Loading({ text }) {
  return (
    <div className="flex justify-center items-center gap-8">
      <div className="ispinner ispinner-large">
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
        <div className="ispinner-blade"></div>
      </div>
      <p>{text}</p>
    </div>
  );
}
