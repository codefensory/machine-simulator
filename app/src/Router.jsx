import React from 'react';
import { SocketProvider } from './providers/socket';
import { InitializeAppProvider } from './providers/InitializeApp';
import { AppScreen } from './screens/App';
import { VideoWallScreen } from './screens/VideoWall';
import { SyncScreen } from './screens/Sync';

export function Router() {
  const vw = window.location.pathname.includes('videowall');

  const sync = window.location.pathname.includes('sync');

  return (
    <>
      {sync ? (
        <SocketProvider>
          <SyncScreen />
        </SocketProvider>
      ) : vw ? (
        <SocketProvider>
          <VideoWallScreen />
        </SocketProvider>
      ) : (
        <InitializeAppProvider>
          <SocketProvider>
            <AppScreen />
          </SocketProvider>
        </InitializeAppProvider>
      )}
    </>
  );
}
