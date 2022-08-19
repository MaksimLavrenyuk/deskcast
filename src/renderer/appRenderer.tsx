import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '../misc/window/components/WindowFrame';
import Application from './components/Application';

console.log('[DKC] : Renderer execution started');

// Application to Render
const app = (
  <WindowFrame title="Deskcast" platform="windows">
    <Application />
  </WindowFrame>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
