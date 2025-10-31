import { useCallback, useEffect, useRef } from 'react';

/**
 * React hook that schedules a repeated callback with `setInterval`.
 *
 * The interval is automatically cleaned up when the component unmounts. Passing `null` or
 * `undefined` as the delay pauses the interval without removing the hook.
 *
 * @param cb Callback invoked on every interval tick.
 * @param delay Delay between executions in milliseconds. Use `null` or `undefined` to pause the interval.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 *
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const [delay, setDelay] = useState<number | null>(null);
 *
 *   useInterval(() => {
 *     setCount((current) => current + 1);
 *   }, delay);
 *
 *   return (
 *     <>
 *       <span>{count}</span>
 *       <button onClick={() => setDelay(1000)}>Start</button>
 *       <button onClick={() => setDelay(null)}>Stop</button>
 *     </>
 *   );
 * }
 * ```
 */
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
