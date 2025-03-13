
import { useEffect, useState, useRef } from 'react';

interface UseAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useAnimation(options: UseAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && currentElement) {
            observer.unobserve(currentElement);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: elementRef, isVisible };
}

export function useSequentialAnimation(
  itemCount: number,
  options: { delay?: number; interval?: number; threshold?: number } = {}
) {
  const { delay = 100, interval = 100, threshold = 0.1 } = options;
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(itemCount).fill(false));
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let timeoutIds: NodeJS.Timeout[] = [];
          
          // Initial delay before starting animations
          const initialTimeout = setTimeout(() => {
            for (let i = 0; i < itemCount; i++) {
              const timeout = setTimeout(() => {
                setVisibleItems(prev => {
                  const updated = [...prev];
                  updated[i] = true;
                  return updated;
                });
              }, i * interval);
              
              timeoutIds.push(timeout);
            }
          }, delay);
          
          timeoutIds.push(initialTimeout);
          
          return () => {
            timeoutIds.forEach(id => clearTimeout(id));
          };
        }
      },
      { threshold }
    );

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [itemCount, delay, interval, threshold]);

  return { containerRef, visibleItems };
}
