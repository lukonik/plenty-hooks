import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useEventListener from './useEventListener';

describe('useEventListener', () => {
  let target: HTMLDivElement;

  beforeEach(() => {
    target = document.createElement('div');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers the handler and invokes it when the event is dispatched', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener(target, 'click', handler));

    const event = new Event('click');
    target.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('removes the listener on unmount', () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(target, 'addEventListener');
    const removeSpy = vi.spyOn(target, 'removeEventListener');

    const { unmount } = renderHook(() => useEventListener(target, 'click', handler));
    const registeredListener = addSpy.mock.calls[0][1] as EventListener;

    target.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();

    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('click', registeredListener, undefined);

    handler.mockClear();
    target.dispatchEvent(new Event('click'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('forwards the provided options to addEventListener', () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(target, 'addEventListener');
    const removeSpy = vi.spyOn(target, 'removeEventListener');
    const options: AddEventListenerOptions = { passive: true, once: true };

    const { unmount } = renderHook(() =>
      useEventListener(target, 'scroll', handler, options)
    );

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), options);

    const registeredListener = addSpy.mock.calls[0][1] as EventListener;

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', registeredListener, options);
  });

  it('always calls the latest handler provided to the hook', () => {
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => useEventListener(target, 'keydown', handler),
      { initialProps: { handler: firstHandler } }
    );

    target.dispatchEvent(new Event('keydown'));
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).not.toHaveBeenCalled();

    rerender({ handler: secondHandler });

    target.dispatchEvent(new Event('keydown'));
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  it('works with the window object as the event target', () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useEventListener(window, 'resize', handler)
    );

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function), undefined);

    window.dispatchEvent(new Event('resize'));
    expect(handler).toHaveBeenCalledTimes(1);

    const registeredListener = addSpy.mock.calls[0][1] as EventListener;

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', registeredListener, undefined);

    handler.mockClear();
    window.dispatchEvent(new Event('resize'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('re-registers the listener when the target changes', () => {
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');
    const handler = vi.fn();

    const { rerender } = renderHook(
      ({ currentTarget }) => useEventListener(currentTarget, 'focus', handler),
      { initialProps: { currentTarget: firstTarget } }
    );

    firstTarget.dispatchEvent(new Event('focus'));
    expect(handler).toHaveBeenCalledTimes(1);

    rerender({ currentTarget: secondTarget });

    handler.mockClear();
    firstTarget.dispatchEvent(new Event('focus'));
    expect(handler).not.toHaveBeenCalled();

    secondTarget.dispatchEvent(new Event('focus'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('re-registers the listener when options change', () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(target, 'addEventListener');
    const removeSpy = vi.spyOn(target, 'removeEventListener');

    const initialOptions: AddEventListenerOptions = { passive: true };
    const updatedOptions: AddEventListenerOptions = { passive: false };

    const { rerender } = renderHook(
      ({ options }) => useEventListener(target, 'mousemove', handler, options),
      { initialProps: { options: initialOptions } }
    );

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), initialOptions);

    const firstRegisteredListener = addSpy.mock.calls[0][1] as EventListener;

    rerender({ options: updatedOptions });

    expect(removeSpy).toHaveBeenCalledWith(
      'mousemove',
      firstRegisteredListener,
      initialOptions
    );
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenLastCalledWith(
      'mousemove',
      expect.any(Function),
      updatedOptions
    );
  });
});
