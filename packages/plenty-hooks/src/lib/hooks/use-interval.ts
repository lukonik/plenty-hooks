import { useCallback, useEffect, useRef } from 'react';

export function useInterval(cb: () => void, delay: number | null | undefined) {
  const savedCb = useRef(cb);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intervalId = useRef<any>(null);
  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  const clear = useCallback(() => {
    if (intervalId.current !== null && intervalId.current !== undefined) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  useEffect(() => {
    if (delay === null || delay === undefined) {
      clear();
      return;
    }

    intervalId.current = setInterval(() => {
      savedCb.current();
    }, delay);

    return () => {
      clear();
    };
  }, [delay, clear]);
}
