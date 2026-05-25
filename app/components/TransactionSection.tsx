"use client";

import styles from "../page.module.css";

export type Transaction = {
  id: string;
  brand: string;
  brandLogo: string;
  phone: string;
  amount: number;
  timestamp: string;
  source?: 'wildgroup' | 'wildgroupau' | '88group' | 'group88';
};

interface TransactionSectionProps {
  deposits: Transaction[];
  withdrawals: Transaction[];
}

// Helper function to get background image URL for transaction items
function getTransactionBgImage(source?: string): string {
  if (source === 'wildgroup' || source === 'wildgroupau') {
    return `/api/proxy-image?url=${encodeURIComponent('https://wildgroupau.com/assets/logo/wildgroup-logo.png')}`;
  } else if (source === '88group' || source === 'group88') {
    return `/api/proxy-image?url=${encodeURIComponent('https://88groupau.com/logo.gif')}`;
  }
  return '';
}

export function TransactionSection({ deposits, withdrawals }: TransactionSectionProps) {
  return (
    <section className={styles.transactionSection}>
      <h2 className={styles.transactionTitle}>
        Real-time withdrawal data from our trusted partners
      </h2>

      <div className={styles.transactionPanel}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}>•</span> LIVE
        </div>

        <div className={styles.transactionGroup}>
          <div className={styles.transactionHeader} style={{ color: '#ff9800' }}>
            <div className={styles.scannerLine}></div>
            <span>DEPOSIT</span>
          </div>
          <div className={styles.transactionList}>
            {deposits.map((tx) => {
              const bgImage = getTransactionBgImage(tx.source);
              return (
                <div 
                  key={tx.id} 
                  className={styles.transactionItem} 
                  data-source={tx.source || ''}
                  style={bgImage ? { 
                    '--bg-image': `url('${bgImage}')` 
                  } as React.CSSProperties & { '--bg-image': string } : undefined}
                >
                  <img src={tx.brandLogo} alt={tx.brand} className={styles.transactionLogo} />
                  <div className={styles.transactionInfo}>
                    <div className={styles.transactionPhone}>{tx.phone}</div>
                  </div>
                  <div className={styles.transactionRight}>
                    <div className={styles.transactionAmount}>AUD {tx.amount.toFixed(2)}</div>
                    <div className={styles.transactionTime}>{tx.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.transactionGroup}>
          <div className={styles.transactionHeader} style={{ color: '#4caf50' }}>
            <div className={styles.scannerLine}></div>
            <span>WITHDRAWAL</span>
          </div>
          <div className={styles.transactionList}>
            {withdrawals.map((tx) => {
              const bgImage = getTransactionBgImage(tx.source);
              return (
                <div 
                  key={tx.id} 
                  className={styles.transactionItem} 
                  data-source={tx.source || ''}
                  style={bgImage ? { 
                    '--bg-image': `url('${bgImage}')` 
                  } as React.CSSProperties & { '--bg-image': string } : undefined}
                >
                  <img src={tx.brandLogo} alt={tx.brand} className={styles.transactionLogo} />
                  <div className={styles.transactionInfo}>
                    <div className={styles.transactionPhone}>{tx.phone}</div>
                  </div>
                  <div className={styles.transactionRight}>
                    <div className={styles.transactionAmount}>AUD {tx.amount.toFixed(2)}</div>
                    <div className={styles.transactionTime}>{tx.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}