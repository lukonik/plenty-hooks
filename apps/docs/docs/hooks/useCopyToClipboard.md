---
sidebar_position: 5
---

# useCopyToClipboard

`useCopyToClipboard` provides a declarative way to copy text to the clipboard. It tracks the last copied string, exposes a stable `copy` function, and lets you hook into success or failure callbacks.

## Usage

```tsx title="ShareLink.tsx"
import { useState } from 'react';
import useCopyToClipboard from 'plenty-hooks';

export function ShareLink() {
  const { copiedText, copy } = useCopyToClipboard();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const url = 'https://plenty-hooks.dev';

  const handleCopy = () => {
    copy(
      url,
      (text) => setStatus('success ', text),
      () => setStatus('error')
    );
  };

  return (
    <div>
      <button onClick={handleCopy}>Copy link</button>
      {status === 'success' && <span>Copied {copiedText}</span>}
      {status === 'error' && <span>Copy failed</span>}
    </div>
  );
}
```

## API

- `useCopyToClipboard()`
  - Returns an object `{ copiedText, copy }`.
    - `copiedText: string | null` – the most recent value that was copied successfully (or `null` if nothing copied yet or the copy failed).
    - `copy(text, onSuccess?, onError?)`
      - `text: string` – value passed to `navigator.clipboard.writeText`.
      - `onSuccess?: (text: string) => void` – called after a successful copy.
      - `onError?: () => void` – called if copying fails (for example, when clipboard access is denied).

The hook itself performs no feature detection; ensure your environment supports the Clipboard API or guard usage behind checks.

## Tips

- **Permissions**: Browsers often require user gestures (e.g., button clicks) to allow clipboard writes. Call `copy` inside event handlers rather than effects.
- **Error handling**: Provide `onError` to surface fallback UI if clipboard access is blocked (private mode, insecure context, or older browsers).
- **State reset**: When a copy attempt fails after a previous success, `copiedText` resets to `null` so UI can reflect the current state accurately.
- **Server-side rendering**: Guard the hook behind `useMount` or equivalent if you render on the server—`navigator` is undefined during SSR.

## Source

```ts
import { useCallback, useState } from 'react';

export default function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copy = useCallback((text: string, onSuccess?: (text: string) => void, onError?: () => void) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(text);
        onSuccess?.(text);
      })
      .catch(() => {
        setCopiedText(null);
        onError?.();
      });
  }, []);

  return { copiedText, copy };
}
```
