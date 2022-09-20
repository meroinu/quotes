import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}