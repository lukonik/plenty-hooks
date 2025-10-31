import { useCallback, useEffect, useRef } from 'react';

/**
 * React hook that schedules a one-off callback with `setTimeout`.
 *
 * The timeout is cleared automatically when the component unmounts. Passing `null` or
 * `undefined` as the delay prevents the timeout from being scheduled until a number is provided.
 *
 * @param cb Callback invoked once after the delay elapses.
 * @param delay Delay before execution in milliseconds. Use `null` or `undefined` to skip scheduling.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 *
 * function DelayedToggle() {
 *   const [visible, setVisible] = useState(false);
 *
 *   useTimeout(() => {
 *     setVisible(true);
 *   }, 1000);
 *
 *   return visible ? <span>Ready!</span> : <span>Waiting...</span>;
 * }
 * ```
 */
export function useTimeout(cb: () => void, delay: number | null | undefined) {
  const savedCb = useRef(cb);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutId = useRef<any>(null);
  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  const clear = useCallback(() => {
    if (timeoutId.current !== null && timeoutId.current !== undefined) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  useEffect(() => {
    if (delay === null || delay === undefined) {
      clear();
      return;
    }

    timeoutId.current = setTimeout(() => {
      savedCb.current();
    }, delay);

    return () => {
      clear();
    };
  }, [delay, clear]);
}
