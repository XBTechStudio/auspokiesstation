"use client";

import { useState, useEffect } from "react";
import styles from "./AITypingText.module.css";

interface AITypingTextProps {
  text: string;
  speed?: number;
}

export function AITypingText({ text, speed = 50 }: AITypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed + Math.random() * 20); // AI-like variable timing

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={styles.aiText}>
      {displayedText}
      {!isComplete && <span className={styles.aiCursor}>|</span>}
      {isComplete && <span className={styles.aiComplete}>✓</span>}
    </span>
  );
}
