"use client";

import { useState } from "react";
import styles from "../page.module.css";

export function IntroSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className={styles.introSection}>
      <h1 className={styles.introH1}>
        88 GROUP × WILD GROUP PARTNERSHIP | Australia's Premium Online Gaming Network {new Date().getFullYear()}
      </h1>

      <h2 className={styles.introH2}>
        88 GROUP × WILD GROUP PARTNERSHIP connects Australian players to trusted gaming platforms offering:
      </h2>

      <ul className={styles.introList}>
        <li>Competitive welcome bonuses and ongoing promotions across partner brands</li>
        <li>Access to thousands of games including pokies, live casino, and table games</li>
        <li>Multiple licensed platforms powered by trusted global providers</li>
        <li>Flexible payment options and professional customer support</li>
      </ul>

      <p className={styles.introPara}>
        <strong>88 GROUP × WILD GROUP PARTNERSHIP</strong> operates as a collective network of premium online gaming brands,
        connecting players to reliable platforms designed for different preferences and play styles.
        Rather than operating a single casino, 88 GROUP × WILD GROUP PARTNERSHIP helps players discover trusted destinations
        for <strong>Australian online pokies</strong> and <strong>real money gameplay</strong>.
      </p>

      {!showMore && (
        <p className={styles.introPara}>
          <a className={styles.readMore} onClick={() => setShowMore(true)} style={{ cursor: 'pointer' }}>
            Read More
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className={styles.readMoreIcon}
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </p>
      )}

      {showMore && (
        <>
          <h2 className={styles.whyChooseTitle}>
            <strong>WHY CHOOSE 88 GROUP × WILD GROUP PARTNERSHIP</strong>
          </h2>

          <p className={styles.whyChoosePara}>
            88 GROUP × WILD GROUP PARTNERSHIP partners with multiple established gaming brands to deliver variety, security, and value
            for Australian players. Whether you enjoy classic pokies, Megaways™, or live dealer games,
            88 GROUP × WILD GROUP PARTNERSHIP ensures access to platforms that prioritise fairness, speed, and player satisfaction.
          </p>

          <ul className={styles.whyChooseList}>
            <li>Access multiple gaming platforms with different bonus structures and game libraries.</li>
            <li>Partner brands operate with licensed systems and SSL-encrypted security.</li>
            <li>Thousands of games including online pokies Australia, live casino, and table games.</li>
            <li>Wide range of welcome offers, reload bonuses, cashback rewards, and VIP programmes.</li>
            <li>Support for bank transfers, e-wallets, and cryptocurrencies including BTC, ETH, USDT, and XRP.</li>
            <li>Mobile-optimised platforms for smooth gameplay on any device.</li>
          </ul>

          <p className={styles.whyChoosePara}>
            88 GROUP × WILD GROUP PARTNERSHIP also actively promotes <strong>responsible gambling</strong> and encourages players
            to choose platforms that offer control tools and fair play policies.
          </p>
        </>
      )}
    </section>
  );
}