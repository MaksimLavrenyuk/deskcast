import adapter from 'webrtc-adapter';
import { ConfigProvider, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import BroadcasterView from './components/BroadcasterView';
import 'antd/dist/reset.css';

console.log(JSON.stringify(adapter.browserDetails));

const { darkAlgorithm } = theme;

function Application() {
  const [darkTheme, setDarkTheme] = useState(true);

  /**
   * On component mount
   */
  useEffect(() => {
    const useDarkTheme = parseInt(localStorage.getItem('dark-mode'), 10);
    if (Number.isNaN(useDarkTheme)) {
      setDarkTheme(true);
    } else if (useDarkTheme === 1) {
      setDarkTheme(true);
    } else if (useDarkTheme === 0) {
      setDarkTheme(false);
    }
  }, []);

  useEffect(() => {
    if (darkTheme) {
      localStorage.setItem('dark-mode', '1');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('dark-mode', '0');
      document.body.classList.remove('dark-mode');
    }
  }, [darkTheme]);

  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <BroadcasterView />
    </ConfigProvider>
  );
}

export default Application;
