import React from 'react';

export function Video(props) {
  return (
    <video
      {...props}
      src={'https://simulador.codefensory.com:6243/videos/' + props.src}
    ></video>
  );
}
