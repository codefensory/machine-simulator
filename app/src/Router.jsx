import React from 'react';
import { App } from './App';
import { SocketProvider } from './providers/socket';
import { InitializeAppProvider } from './providers/InitializeApp';
import { VW } from './VW';

export function Router() {
  const vw = window.location.pathname.includes('videowall');

  return (
    <>
      {vw ? (
        <SocketProvider>
          <VW />
        </SocketProvider>
      ) : (
        <InitializeAppProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </InitializeAppProvider>
      )}
    </>
  );
}
