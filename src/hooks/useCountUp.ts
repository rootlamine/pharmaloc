import { useState, useEffect, useRef } from "react";

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Animates a number from 0 to `end` over `duration` ms.
 * Only starts when `enabled` is true.
 */
export function useCountUp(
  end: number,
  duration: number = 2000,
  enabled: boolean = true
): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    startTimeRef.current = undefined;
    setCount(0);

    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      setCount(Math.round(eased * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, enabled]);

  return count;
}
