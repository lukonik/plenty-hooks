import { renderHook, waitFor } from '@testing-library/react';
import { describe } from 'vitest';
import useMount from './useMount';

describe('useMount', () => {
  it('returns false on first render and true after the effect runs', async () => {
    const states: boolean[] = [];
    const { result } = renderHook(() => {
      const mounted = useMount();
      states.push(mounted);
      return mounted;
    });

    expect(states[0]).toBe(false);
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    expect(states).toContain(true);
  });

  it('remains true across re-renders once mounted', async () => {
    const states: boolean[] = [];
    const { result, rerender } = renderHook(() => {
      const mounted = useMount();
      states.push(mounted);
      return mounted;
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    rerender();

    expect(result.current).toBe(true);
    expect(states.at(-1)).toBe(true);
  });
});
