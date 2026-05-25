"use client";

import { ReactNode } from 'react';
import styles from './SplitLayout.module.css';

interface SplitLayoutProps {
  leftTitle?: string | ReactNode;
  rightTitle?: string | ReactNode;
  leftContent: ReactNode;
  rightContent: ReactNode;
  className?: string;
}

export function SplitLayout({
  leftTitle,
  rightTitle,
  leftContent,
  rightContent,
  className = '',
}: SplitLayoutProps) {
  return (
    <div className={`${styles.splitLayout} ${className}`}>
      <div className={styles.splitContainer}>
        <div className={styles.splitColumn}>
          {leftTitle && (
            <div className={styles.splitTitle}>
              {typeof leftTitle === 'string' ? <h2>{leftTitle}</h2> : leftTitle}
            </div>
          )}
          <div className={styles.splitContent}>{leftContent}</div>
        </div>
        <div className={styles.splitDivider}></div>
        <div className={styles.splitColumn}>
          {rightTitle && (
            <div className={styles.splitTitle}>
              {typeof rightTitle === 'string' ? <h2>{rightTitle}</h2> : rightTitle}
            </div>
          )}
          <div className={styles.splitContent}>{rightContent}</div>
        </div>
      </div>
    </div>
  );
}
