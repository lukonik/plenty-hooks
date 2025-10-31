import { useCallback, useState } from 'react';

/**
 * Provides a stable `copy` function for writing strings to the clipboard while
 * tracking the most recently copied value.
 *
 * If you need to work with the copied string inside `onSuccess`, rely on the
 * `text` argument passed to that callback. The exposed `copiedText` state
 * updates on the next render and may still contain the previous value within
 * the same tick.
 */
export default function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  /**
   * Copies the provided `text` to the clipboard.
   *
   * @param text - The string to write to the clipboard.
   * @param onSuccess - Invoked after a successful copy operation.
   * @param onError - Invoked if the clipboard write fails for any reason.
   */
  const copy = useCallback(
    (
      text: string,
      onSuccess?: (text: string) => void,
      onError?: () => void
    ) => {
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
    },
    []
  );

  return { copiedText, copy };
}
