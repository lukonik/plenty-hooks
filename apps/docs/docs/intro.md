---
sidebar_position: 1
slug: /
title: Introduction
---

Welcome to Plenty Hooks — a lightweight collection of reusable React hooks focused on strong typing and practical ergonomics. The goal is to bundle finely-crafted utilities you can drop into any React project without extra dependencies.

## Installation

Install the package with the manager your project already uses:

```bash
npm install plenty-hooks
# or
pnpm add plenty-hooks
# or
yarn add plenty-hooks
```

## Quick Example

The current release bundles a `useInterval` hook that lets you run a callback on a set cadence while keeping React state in sync. The interval automatically pauses when the component unmounts or when the delay becomes `null`.

```tsx
import {useState} from 'react';
import {useInterval} from 'plenty-hooks';

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setRunning] = useState(false);

  useInterval(
    () => setElapsed((value) => value + 1),
    isRunning ? 1000 : null,
  );

  return (
    <div>
      <p>{elapsed}s</p>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => setElapsed(0)}>Reset</button>
    </div>
  );
}
```

## Next Steps

- Browse the `hooks` directory for more utilities as they are added.
- Check the package changelog to see new hooks as they land.
- Contribute your own hooks by opening a pull request.
