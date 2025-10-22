---
sidebar_position: 1
slug: /
title: Introduction
---

Welcome to Plenty Hooks — a lightweight collection of reusable React hooks focused on strong typing and practical ergonomics. The goal is to bundle finely-crafted utilities you can drop into any React project without extra dependencies.

## Installation

```bash
npm install plenty-hooks
# or
pnpm add plenty-hooks
# or
yarn add plenty-hooks
```

## Quick Example

```tsx
import { useState } from 'react';
import { useInterval } from 'plenty-hooks';

export function Ticker() {
  const [seconds, setSeconds] = useState(0);

  useInterval(() => {
    setSeconds((value) => value + 1);
  }, 1000);

  return <p>Ticking for {seconds}s</p>;
}
```

## New Hook Feature

If you want to have a new hook, create a feature request [on GitHub](https://github.com/lukonik/plenty-hooks/issues/new). 🚀
