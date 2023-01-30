import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <T extends object>(key: string) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const setItem = useCallback((value: T) => {
    setData(value);
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  useEffect(() => {
    if (!window) return;
    setIsBrowser(true);

    const item = window.localStorage.getItem(key);

    if (item) setData(JSON.parse(item));
    else setData(null);
  }, [isBrowser]);

  return [data, setItem] as const;
};

export default useLocalStorage;
