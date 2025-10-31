---
sidebar_position: 3
---

# useInterval

`useInterval` is a React Hook that runs `setInterval` internally and clears it automatically when the component unmounts. It also keeps the latest version of your callback, so you do not need to memoise it yourself.

## Usage

```tsx title="Counter.tsx"
import { useState } from 'react';
import { useInterval } from 'plenty-hooks';

export function Counter() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState<number | null>(1000);

  useInterval(() => {
    setCount((current) => current + 1);
  }, delay);

  return (
    <>
      <span>Count: {count}</span>
      <button onClick={() => setDelay(1000)}>Start</button>
      <button onClick={() => setDelay(null)}>Stop</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}
```

## API

- `useInterval(cb, delay)`
  - `cb: () => void` – function executed on every tick. The most recent function is always invoked.
  - `delay: number | null | undefined` – time in milliseconds between ticks. Pass `null` or `undefined` to pause the interval without tearing the hook down.

The hook does not return a value. Cleanup is handled automatically when the component unmounts or when the interval is paused.

## Tips

- **Pause and resume**: Store the delay in state (as in the example above) to start/stop the interval imperatively.
- **Latest callback**: Because `useInterval` stores the latest callback in a ref, you can safely use inline functions without `useCallback`.
- **Cleanup**: You do not need a manual `clearInterval`; the hook clears it whenever the delay changes or the component leaves the tree.

## Source

```ts
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
```
