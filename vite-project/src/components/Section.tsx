import { useRef, useEffect, useState } from "react";
import type { ReactNode } from "react";
import '../style/Section.css'


interface SectionProps {
  children: ReactNode;
}

export default function Section({ children }: SectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section ${visible ? "visible" : ""}`}>
      {children}
    </div>
  );
}
0