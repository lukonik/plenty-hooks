import { useEffect, useRef } from 'react';

/**
 * Hook that runs a callback function when the component is unmounted.
 * @param cb - Callback function to be executed on component unmount
 */
export default function useUnmount(cb: () => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    return () => {
      cbRef.current();
    };
  }, []);
}
