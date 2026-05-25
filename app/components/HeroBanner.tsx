"use client";

import styles from "../page.module.css";

export function HeroBanner() {
  const year = new Date().getFullYear();

  return (
    <div className={styles.heroBanner}>
      <div className={styles.bannerImageContainer}>
        <img
          src="/1.gif"
          alt="Banner"
          className={styles.bannerImage}
        />
      </div>
      <div className={styles.wrap}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            88 GROUP × WILD GROUP PARTNERSHIP Best Online Casinos Australia for Real Money & Bonuses in {year}
          </h1>
          <p className={styles.heroSubtitle}>
            One gateway. Multiple verified brands.<br />
            Fast access, transparent data, real-time withdrawals.
          </p>

          <div className={styles.heroValuePoints}>
            <div className={styles.heroValuePoint}>
              <span className={styles.checkmark}>✔</span>
              <span>Verified Australian-focused gaming brands</span>
            </div>
            <div className={styles.heroValuePoint}>
              <span className={styles.checkmark}>✔</span>
              <span>Real-time deposit & withdrawal records</span>
            </div>
            <div className={styles.heroValuePoint}>
              <span className={styles.checkmark}>✔</span>
              <span>Secure access, fair play, proven reliability</span>
            </div>
            <div className={styles.heroValuePoint}>
              <span className={styles.checkmark}>✔</span>
              <span>Choose the brand that fits you best</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}