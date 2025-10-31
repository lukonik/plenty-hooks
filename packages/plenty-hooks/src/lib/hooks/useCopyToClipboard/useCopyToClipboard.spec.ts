import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useCopyToClipboard from './useCopyToClipboard';

describe('useCopyToClipboard', () => {
  const originalClipboard = navigator.clipboard;
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextMock = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    if (originalClipboard !== undefined) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: originalClipboard,
      });
    } else {
      Reflect.deleteProperty(navigator as any, 'clipboard');
    }
    vi.resetAllMocks();
  });

  it('initially exposes null as the copied text', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copiedText).toBeNull();
  });

  it('copies text successfully and updates state/onSuccess callback', async () => {
    writeTextMock.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(() => useCopyToClipboard());

    act(() => {
      result.current.copy('Hello world', onSuccess, onError);
    });

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith('Hello world');

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('Hello world');
      expect(result.current.copiedText).toBe('Hello world');
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles errors, resets state, and invokes onError', async () => {
    writeTextMock.mockRejectedValue(new Error('fail'));
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(() => useCopyToClipboard());

    act(() => {
      result.current.copy('Oops', onSuccess, onError);
    });

    expect(writeTextMock).toHaveBeenCalledWith('Oops');

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(result.current.copiedText).toBeNull();
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('resets copied text to null when a subsequent copy fails', async () => {
    writeTextMock.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('fail'));

    const successCallback = vi.fn();
    const errorCallback = vi.fn();

    const { result } = renderHook(() => useCopyToClipboard());

    act(() => {
      result.current.copy('First', successCallback);
    });

    await waitFor(() => {
      expect(result.current.copiedText).toBe('First');
    });

    act(() => {
      result.current.copy('Second', undefined, errorCallback);
    });

    await waitFor(() => {
      expect(errorCallback).toHaveBeenCalledTimes(1);
      expect(result.current.copiedText).toBeNull();
    });
  });

  it('returns a stable copy function between renders', () => {
    writeTextMock.mockResolvedValue(undefined);
    const { result, rerender } = renderHook(() => useCopyToClipboard());

    const firstCopy = result.current.copy;
    rerender();
    expect(result.current.copy).toBe(firstCopy);
  });
});
