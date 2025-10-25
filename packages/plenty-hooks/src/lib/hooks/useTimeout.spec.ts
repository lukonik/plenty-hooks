import { renderHook } from '@testing-library/react';
import { beforeEach, describe, vi } from 'vitest';
import { useTimeout } from './useTimeout';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const mock = vi.fn((_param?: string) => {});

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });
  it('should call the callback after the specified delay', () => {
    renderHook(() => useTimeout(mock, 1000));
    vi.advanceTimersByTime(1000);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it('should not call the callback more than once', () => {
    renderHook(() => useTimeout(mock, 100));
    vi.advanceTimersByTime(1000);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it('should not call the callback if delay is null', () => {
    renderHook(() => useTimeout(mock, null));
    vi.advanceTimersByTime(5000);
    expect(mock).not.toHaveBeenCalled();
  });
  it('should not call the callback if delay is undefined', () => {
    renderHook(() => useTimeout(mock, undefined));
    vi.advanceTimersByTime(5000);
    expect(mock).not.toHaveBeenCalled();
  });
  it('should clear the timeout when unmounted before execution', () => {
    const { unmount } = renderHook(() => useTimeout(mock, 1000));
    vi.advanceTimersByTime(500);
    unmount();
    vi.advanceTimersByTime(1000);
    expect(mock).not.toHaveBeenCalled();
  });
  it('should clear the timeout when delay changes to null', () => {
    const { rerender } = renderHook<void, { delay: number | null }>(
      ({ delay }) => useTimeout(mock, delay),
      {
        initialProps: { delay: 1000 },
      }
    );
    vi.advanceTimersByTime(500);
    rerender({ delay: null });
    vi.advanceTimersByTime(1000);
    expect(mock).not.toHaveBeenCalled();
  });
  it('should schedule timeout when delay changes from null to a number', () => {
    const { rerender } = renderHook<void, { delay: number | null }>(
      ({ delay }) => useTimeout(mock, delay),
      {
        initialProps: { delay: null },
      }
    );
    vi.advanceTimersByTime(500);
    expect(mock).not.toHaveBeenCalled();
    rerender({ delay: 1000 });
    vi.advanceTimersByTime(1000);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it('should use the latest callback if it changes before execution', () => {
    const runner = vi.fn();
    const { rerender } = renderHook<void, { cb: () => void }>(
      ({ cb }) => useTimeout(cb, 1000),
      {
        initialProps: { cb: () => runner('first') },
      }
    );
    vi.advanceTimersByTime(500);
    rerender({ cb: () => runner('second') });
    vi.advanceTimersByTime(500);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(runner).toHaveBeenNthCalledWith(1, 'second');
  });
});
