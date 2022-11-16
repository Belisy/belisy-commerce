import { useEffect, useState } from "react";

const useDebounce = <T = any>(value: T, delay = 600) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(() => value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    //딜레이동안 이값이 바뀐다면 계속 무시되다가 그 값이 600미리초동안 안바꼈다면 그값을리턴
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
