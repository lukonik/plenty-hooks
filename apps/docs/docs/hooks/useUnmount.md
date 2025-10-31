---
sidebar_position: 2
---

# useUnmount

`useUnmount` is a React Hook that executes a callback when the component leaves the tree. The hook captures the latest version of your callback, so you can update it without worrying about stale closures.

## Usage

```tsx title="ResizeLogger.tsx"
import { useCallback, useEffect } from 'react';
import { useUnmount } from 'plenty-hooks';

export function ResizeLogger() {
  const log = useCallback(() => {
    console.log('Viewport width:', window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', log);
  }, [log]);

  useUnmount(() => {
    window.removeEventListener('resize', log);
    console.log('Resize listener removed');
  });

  return null;
}
```

## API

- `useUnmount(cb)`
  - `cb: () => void` – function invoked exactly once when the component unmounts. The hook always calls the most recent version you supplied.

The hook does not return a value.

## Tips

- **Centralise teardown**: Place analytics calls or imperative cleanup in a single `useUnmount` callback instead of scattering them across multiple effects.
- **Latest callback**: Update the callback while the component is mounted—the hook keeps a ref so the newest logic runs on unmount.
- **Pair with subscriptions**: Combine with effects that subscribe to external events to guarantee the unsubscribe happens even if the component unmounts abruptly.

## Source

Copy the implementation directly if you only need this hook.

```ts
import { useEffect, useRef } from 'react';

export function useUnmount(cb: () => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    return () => {
      cbRef.current();
    };
  }, []);
}
```
