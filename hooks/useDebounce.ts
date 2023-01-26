import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number = 400) => {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(query);
    }, delay);

    return () => clearTimeout(timeout);
  }, [query, delay]);

  return debounced;
};

export default useDebounce;
