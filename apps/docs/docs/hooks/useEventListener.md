---
sidebar_position: 2
---

# useEventListener

`useEventListener` attaches a DOM event listener to any `EventTarget` (for example `window`, `document`, or a media element) and keeps the handler in sync with React renders. The hook automatically re-registers the listener when its inputs change and removes it during cleanup.

## Usage

```tsx title="ResizeWatcher.tsx"
import { useState } from 'react';
import useEventListener from 'plenty-hooks';

export function ResizeWatcher() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEventListener(window, 'resize', () => setWidth(window.innerWidth));

  return <span>Viewport width: {width}px</span>;
}
```

You can also observe custom targets, such as a ref exposed through props.

```tsx title="VideoProgress.tsx"
import { useMemo, useState } from 'react';
import useEventListener from 'plenty-hooks';

type VideoProgressProps = { player: HTMLVideoElement };

export function VideoProgress({ player }: VideoProgressProps) {
  const [progress, setProgress] = useState(0);

  useEventListener(player, 'timeupdate', () => {
    setProgress(player.currentTime);
  });

  return <progress max={player.duration || 1} value={progress} />;
}
```

## API

- `useEventListener(target, eventName, handler, options?, deps?)`
  - `target: EventTarget` – object that exposes `addEventListener`.
  - `eventName: string` – the event to listen for.
  - `handler: EventListener` – callback invoked with the native `Event`.
  - `options?: AddEventListenerOptions | boolean` – passed directly to `addEventListener` and `removeEventListener`.
  - `deps?: DependencyList` – currently reserved; the hook already re-subscribes when any argument changes.

The hook returns `void`. Cleanup happens automatically when the component unmounts or when any dependency changes.

## Tips

- **Stable targets**: Ensure the `target` exists at render time. When working with DOM refs, wait until the element is available (for example by using `useMount`) before rendering the hook.
- **Latest handler**: Inline handlers are safe; the hook stores the most recent handler in a ref to avoid stale closures.
- **Options parity**: Whatever you pass in `options` will be used for both adding and removing the listener, mirroring the native API.
- **Cross-environment**: Works for browser globals (`window`, `document`) as well as other `EventTarget` implementations such as `AbortSignal` or custom emitters.

## Source

```ts
import { DependencyList, useEffect, useRef } from 'react';

export default function useEventListener(target: EventTarget, eventName: string, handler: EventListener, options?: EventListenerOptions, deps?: DependencyList) {
  const saveHandler = useRef(handler);
  useEffect(() => {
    saveHandler.current = handler;
  });
  useEffect(() => {
    const listener = (event: Event) => {
      saveHandler.current(event);
    };
    target.addEventListener(eventName, listener, options);
    return () => {
      target.removeEventListener(eventName, listener, options);
    };
  }, [target, eventName, options, handler]);
}
```
