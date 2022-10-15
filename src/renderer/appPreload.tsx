import { contextBridge, ipcRenderer } from 'electron';
import IpcRendererManagerImpl from '../utils/IpcManager/IpcRendererManager';

IpcRendererManagerImpl.install(contextBridge, ipcRenderer);

// window.addEventListener('DOMContentLoaded', () => {});
