"use client";

import styles from "./QuantumStatus.module.css";

interface QuantumStatusProps {
  text?: string;
}

export function QuantumStatus({ text = "SYSTEM STATUS: OPERATIONAL" }: QuantumStatusProps) {
  return (
    <div className={styles.quantumStatus}>
      <div className={styles.statusIndicator}>
        <div className={styles.quantumBit}></div>
        <span>{text}</span>
      </div>
    </div>
  );
}
