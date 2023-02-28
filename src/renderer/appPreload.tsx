import { contextBridge, ipcRenderer } from 'electron';
import IpcManager from '../core/IpcManager';

IpcManager.installInRenderer(contextBridge, { ipcRenderer });

// window.addEventListener('DOMContentLoaded', () => {});
