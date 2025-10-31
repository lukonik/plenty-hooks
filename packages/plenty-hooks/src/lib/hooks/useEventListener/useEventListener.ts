import { useEffect, useRef } from 'react';

export default function useEventListener(
  target: EventTarget,
  eventName: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  const saveHandler = useRef(handler);
  useEffect(() => {
    saveHandler.current = handler;
  });
  useEffect(() => {
    const listener = (event: Event) => {
      saveHandler.current(event);
    };
    target.addEventListener(eventName, listener, options);
    return () => {
      target.removeEventListener(eventName, listener, options);
    };
  }, [target, eventName, options, handler]);
}
