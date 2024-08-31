import { defineConfig } from 'vite';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    sourcemap: true,
    assetsDir: 'code',
  },
  server: {
    port: 443,
    host: 'simulador.codefensory.com',
    https: {
      key: fs.readFileSync(`../simulador.codefensory.com/privkey1.pem`),
      cert: fs.readFileSync(`../simulador.codefensory.com/cert1.pem`),
    },
  },
});
