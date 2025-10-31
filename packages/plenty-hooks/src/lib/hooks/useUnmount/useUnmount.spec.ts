import { renderHook } from '@testing-library/react';
import { describe, vi } from 'vitest';
import useUnmount from './useUnmount';

describe('useUnmount', () => {
  it('invokes the callback when the component unmounts', () => {
    const cb = vi.fn();
    const { unmount } = renderHook(() => useUnmount(cb));

    expect(cb).not.toHaveBeenCalled();

    unmount();

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('uses the latest callback provided before unmount', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender, unmount } = renderHook(
      ({ handler }) => useUnmount(handler),
      {
        initialProps: { handler: first },
      }
    );

    rerender({ handler: second });
    unmount();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
