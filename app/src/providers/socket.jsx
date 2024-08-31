import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = io('wss://simulador.codefensory.com:6243');

    setSocket(ws);

    ws.on('connect', () => {
      ws.emit('reset');

      setConnected(true);
    });

    ws.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  if (!socket || !connected) {
    return null;
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
