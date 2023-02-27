import { contextBridge, ipcRenderer } from 'electron';
import IpcManager from '../utils/IpcManager';

IpcManager.installInRenderer(contextBridge, { ipcRenderer });

// window.addEventListener('DOMContentLoaded', () => {});
