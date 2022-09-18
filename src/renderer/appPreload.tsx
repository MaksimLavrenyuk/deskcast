import { contextBridge, ipcRenderer } from 'electron';
import IpcRendererManagerImpl from '../utils/IpcManager/IpcRendererManager';
import '../watcher-web';

IpcRendererManagerImpl.install(contextBridge, ipcRenderer);

// window.addEventListener('DOMContentLoaded', () => {});
