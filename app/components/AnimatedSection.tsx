"use client";

import { ReactNode, useMemo } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import animStyles from '../styles/animations.module.css';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'quantumFade' | 'neuralExpand';
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = ''
}: AnimatedSectionProps) {
  const observerOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true
  }), []);

  const [ref, isVisible] = useIntersectionObserver(observerOptions);

  const animationClass = `${animation}OnScroll`;
  
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${animStyles.animateOnScroll} ${animStyles[animationClass]} ${isVisible ? animStyles.visible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
