---
sidebar_position: 1
---

# useMount

`useMount` is a React Hook that returns `true` once the component has mounted on the client. This helps you guard browser-only UI until after hydration completes, preventing server/client mismatches.

## Usage

```tsx title="ClientOnly.tsx"
import type { ReactNode } from 'react';
import { useMount } from 'plenty-hooks';

export function ClientOnly({ children }: { children: ReactNode }) {
  const isMounted = useMount();

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
```

## API

- `useMount()`
  - Returns `false` during the initial render and flips to `true` after the component mounts. The hook reverts to `false` when the component unmounts.

## Tips

- **Gate browser APIs**: Wrap logic that depends on `window`, `document`, or layout measurements so it only runs when `useMount()` returns `true`.
- **SSR friendly**: Combine with placeholders or skeletons to avoid hydration warnings when server-rendered markup differs from the client.
- **Unmount reset**: If the component leaves the tree and re-mounts later, the hook will emit `false` again until the effect runs.

## Source

Copy the implementation if you need the hook in isolation.

```ts
import { useEffect, useState } from 'react';

export function useMount() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}
```
