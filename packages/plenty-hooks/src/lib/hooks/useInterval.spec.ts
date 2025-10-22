import { renderHook } from '@testing-library/react';
import { beforeEach, describe, vi } from 'vitest';
import { useInterval } from './useInterval';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const mock = vi.fn((_param?: string) => {});

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });
  it('should call the callback after the specified delay', () => {
    renderHook(() => useInterval(mock, 1000));
    vi.advanceTimersByTime(1000);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it('should call couple of times the callback after the specified delay', () => {
    renderHook(() => useInterval(mock, 500));
    vi.advanceTimersByTime(2500);
    expect(mock).toHaveBeenCalledTimes(5);
  });
  it('should not call the callback if delay is null', () => {
    renderHook(() => useInterval(mock, null));
    vi.advanceTimersByTime(5000);
    expect(mock).not.toHaveBeenCalled();
  });
  it('should not call the callback if delay is undefined', () => {
    renderHook(() => useInterval(mock, undefined));
    vi.advanceTimersByTime(5000);
    expect(mock).not.toHaveBeenCalled();
  });
  it('should stop calling the callback when unmounted', () => {
    const { unmount } = renderHook(() => useInterval(mock, 1000));
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(3);
    unmount();
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(3);
  });
  it('should stop calling when delay changes to null', () => {
    const { rerender } = renderHook<void, { delay: number | null }>(
      ({ delay }) => useInterval(mock, delay),
      {
        initialProps: { delay: 1000 },
      }
    );
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(3);
    rerender({ delay: null });
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(3);
  });
  it('should resume calling when delay changes from null to a number', () => {
    const { rerender } = renderHook<void, { delay: number | null }>(
      ({ delay }) => useInterval(mock, delay),
      {
        initialProps: { delay: null },
      }
    );
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(0);
    rerender({ delay: 1000 });
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(3);
  });
  it('should use the latest callback if it changes', () => {
    const { rerender } = renderHook<void, { cb: () => void }>(
      ({ cb }) => useInterval(cb, 1000),
      {
        initialProps: { cb: () => mock('first') },
      }
    );
    vi.advanceTimersByTime(2000);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(mock).toHaveBeenNthCalledWith(1, 'first');
    expect(mock).toHaveBeenNthCalledWith(2, 'first');

    rerender({ cb: () => mock('second') });
    vi.advanceTimersByTime(2000);
    expect(mock).toHaveBeenCalledTimes(4);
    expect(mock).toHaveBeenNthCalledWith(3, 'second');
    expect(mock).toHaveBeenNthCalledWith(4, 'second');
  });
});
