import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import './index.css';
import { SocketProvider } from './providers/socket';
import { Router } from './Router';

const container = document.getElementById('app');

const root = createRoot(container);

root.render(<Router />);
