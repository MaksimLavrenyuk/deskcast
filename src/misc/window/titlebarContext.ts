import { ipcRenderer } from 'electron';

const titlebarContext = {
  exit() {
    ipcRenderer.invoke('window-close');
  },
  reload() {
    ipcRenderer.invoke('web-reload');
  },
  toggle_devtools() {
    ipcRenderer.invoke('web-toggle-devtools');
  },
  actual_size() {
    ipcRenderer.invoke('web-actual-size');
  },
  zoom_in() {
    ipcRenderer.invoke('web-zoom-in');
  },
  zoom_out() {
    ipcRenderer.invoke('web-zoom-out');
  },
  toggle_fullscreen() {
    ipcRenderer.invoke('web-toggle-fullscreen');
  },
  minimize() {
    ipcRenderer.invoke('window-minimize');
  },
  toggle_maximize() {
    ipcRenderer.invoke('window-toggle-maximize');
  },
  open_url(url: string) {
    ipcRenderer.invoke('open-url', url);
  },
};

export type TitlebarContextApi = typeof titlebarContext;

export default titlebarContext;
