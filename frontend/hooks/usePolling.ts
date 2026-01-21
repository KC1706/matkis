import { useEffect, useRef } from 'react';

export function usePolling(
  callback: () => void,
  delay: number | null,
  immediate: boolean = true
) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    if (immediate) {
      savedCallback.current?.();
    }

    const id = setInterval(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearInterval(id);
  }, [delay, immediate]);
}
