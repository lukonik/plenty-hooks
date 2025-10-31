import { useEffect, useState } from 'react';

/**
 * Hook that returns a boolean indicating whether the component is currently mounted.
 * It can be used to render differen JSX on server and client side.
 *
 * @example
 * ```tsx
 * import useMount from 'plenty-hooks';
 *
 * function MyComponent() {
 *   const isMounted = useMount();
 *   return <div>{isMounted ? 'Client' : 'Server'}</div>;
 * }
 * ```
 * @returns A boolean indicating whether the component is currently mounted.
 */
export default function useMount() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted;
}
