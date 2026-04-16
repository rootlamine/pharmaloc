import { type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type Animation = "fade-up" | "fade-left" | "fade-right" | "fade";

interface RevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
}

export default function Reveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: RevealProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`reveal reveal-${animation} ${inView ? "reveal-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
