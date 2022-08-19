import React, { useEffect, useRef, useMemo } from 'react';
import logo from '../../../assets/images/logo.png';
import Titlebar from './Titlebar';

type Props = {
  title?: string;
  borderColor?: string;
  platform: 'windows' | 'mac';
  children: React.ReactNode;
};

type Context = {
  platform: 'windows' | 'mac';
};

export const WindowContext = React.createContext<Context>({
  platform: 'windows',
});

function WindowFrame(props: Props) {
  const {
    borderColor, platform, title, children,
  } = props;
  const itsRef = useRef<HTMLDivElement>(null);

  const providerValue = useMemo(() => ({ platform }), [platform]);

  useEffect(() => {
    const { parentElement } = itsRef.current;
    parentElement.classList.add('has-electron-window');
    parentElement.classList.add('has-border');

    // Apply border color if prop given
    if (borderColor) {
      parentElement.style.borderColor = borderColor;
    }
  }, [borderColor]);

  return (
    <WindowContext.Provider value={providerValue}>
      {/* Reference creator */}
      <div className="start-electron-window" ref={itsRef} />
      {/* Window Titlebar */}
      <Titlebar
        title={title ?? 'Electron Window'}
        mode="centered-title"
        icon={logo}
      />
      {/* Window Content (Application to render) */}
      <div className="window-content">{children}</div>
    </WindowContext.Provider>
  );
}

export default WindowFrame;
