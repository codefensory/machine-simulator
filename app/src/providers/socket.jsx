import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import io from 'socket.io-client';
import { ScreenLoading } from '../components/ScreenLoading';

const SocketContext = createContext();

let serverClientDiff = 0;

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  const [connected, setConnected] = useState(false);

  const [synchronized, setSynchronized] = useState(false);

  const delayRef = useRef(0);

  useEffect(() => {
    const ws = io('wss://simulador.codefensory.com:6243');

    setSocket(ws);

    ws.on('connect', () => {
      const now = Date.now();

      ws.emit('reset');

      const runDiff = (newNow) => {
        ws.emit('diff', newNow, (diff) => {
          serverClientDiff = serverClientDiff + diff;

          if (diff !== 0) {
            console.log('mucho', diff);

            runDiff(Date.now() + serverClientDiff);
          } else {
            setSynchronized(true);
          }
        });
      };

      ws.emit('now', Date.now(), (clientTime, serverTime) => {
        serverClientDiff = serverTime - now;

        delayRef.current = Date.now() - clientTime;

        const newNow = Date.now() + serverClientDiff;

        runDiff(newNow);
      });

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
    return <ScreenLoading text="Conectando" />;
  }

  if (!synchronized) {
    return <ScreenLoading text="Sincronizando" />;
  }

  socket.now = () => {
    return Date.now() + serverClientDiff;
  };

  socket.delay = () => delayRef.current;

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
