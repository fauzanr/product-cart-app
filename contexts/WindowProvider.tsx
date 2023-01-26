import React, { createContext, useContext, useEffect, useState } from "react";

const DEFAULT_STATE = {
  isMobile: false,
};

const WindowContext = createContext(DEFAULT_STATE);

export const useWindow = () => useContext(WindowContext);

const WindowProvider = ({ children }: { children: JSX.Element }) => {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 600) setState({ isMobile: true });
      else setState({ isMobile: false });
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <WindowContext.Provider value={state}>{children}</WindowContext.Provider>
  );
};

export default WindowProvider;
