import React from 'react';
import { createRoot } from 'react-dom/client';
import Application from './Application';
import './Application.scss';

// Application to Render
const app = (
  <Application />
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
