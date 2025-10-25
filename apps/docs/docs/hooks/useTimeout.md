---
sidebar_position: 4
---

# useTimeout

`useTimeout` is a React Hook that wraps `setTimeout`, ensuring the timer is cleared when the component unmounts or the delay changes. The hook keeps the latest callback in sync, so you do not have to memoise it manually.

## Usage

```tsx title="DelayedMessage.tsx"
import { useState } from 'react';
import { useTimeout } from 'plenty-hooks';

export function DelayedMessage() {
  const [ready, setReady] = useState(false);

  useTimeout(() => {
    setReady(true);
  }, 1500);

  return <span>{ready ? 'All set!' : 'Preparing...'}</span>;
}
```

## API

- `useTimeout(cb, delay)`
  - `cb: () => void` – function executed once after the delay elapses. The most recent function is always used.
  - `delay: number | null | undefined` – time in milliseconds before the callback fires. Pass `null` or `undefined` to skip scheduling.

The hook does not return a value. Cleanup is handled automatically when the component unmounts or when the delay changes.

## Tips

- **Skip scheduling**: Store the delay in state to opt-in or out of running the timeout.
- **Latest callback**: Inline callbacks remain safe because the hook stores the latest version internally.
- **Manual cleanup not needed**: The timeout is cleared automatically on unmount or when the delay changes to `null`/`undefined`.

## Source

Copy this implementation into your project if you only need the hook.

```ts
import { useCallback, useEffect, useRef } from 'react';

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
```
