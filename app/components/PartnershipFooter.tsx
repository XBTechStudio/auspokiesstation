"use client";

import styles from "../page.module.css";

export function PartnershipFooter() {
  const licenseItems = [
    {src: 'https://redvortex8.com/media/ab7a1af4b109604f012da.png', alt: 'Pagcor'},
    {src: 'https://redvortex8.com/media/59d7c605b10967a5928d6.png', alt: 'Gaming Gacor'},
    {src: 'https://redvortex8.com/media/0c0b4315b10968a6673af.png', alt: 'Gaming-laboratories'},
    {src: 'https://redvortex8.com/media/e7bd6f15b10964c1a2559.png', alt: 'itech-labs'},
    {src: 'https://redvortex8.com/media/75c6ea25b1096b913a5bf.png', alt: 'iovation'},
    {src: 'https://redvortex8.com/media/d63cc535b1096dfea235a.png', alt: 'bmm'},
    {src: 'https://redvortex8.com/media/5fcee045b10962a4777a7.png', alt: 'threatmetrix'},
    {src: 'https://redvortex8.com/media/80a2db45b1096bde1613c.png', alt: 'tst-verified'},
    {src: 'https://redvortex8.com/media/85a3b955b1096ba696173.png', alt: 'godaddy-verified'},
  ];

  const paymentItems = [
    {name: 'Visa-Card', src: 'https://redvortex8.com/media/d655bd51b1096289cd254.png'},
    {name: 'Master-Card', src: 'https://redvortex8.com/media/50867071b1096c27a8701.png'},
    {name: 'Nab', src: 'https://redvortex8.com/media/f0a76f71b109604f5b40e.png'},
    {name: 'Westpac', src: 'https://redvortex8.com/media/0b93fc81b109672492930.png'},
    {name: 'USDT', src: 'https://redvortex8.com/media/48ca5a91b109645268b28.png'},
    {name: 'TRON', src: 'https://redvortex8.com/media/577d37a1b1096aec30cbf.png'},
    {name: 'BNBSMARTCHAIN', src: 'https://redvortex8.com/media/188575b1b1096604810c5.png'},
    {name: 'BITCOIN', src: 'https://redvortex8.com/media/12877ac1b1096000e6238.png'},
    {name: 'ETHEREUM', src: 'https://redvortex8.com/media/134006d1b1096640594ed.png'},
    {name: 'USDC', src: 'https://redvortex8.com/media/a29b31e1b1096e0b32bab.png'},
    {name: 'USDD', src: 'https://redvortex8.com/media/ddfc8de1b1096357fdf22.png'},
    {name: 'FDUSD', src: 'https://redvortex8.com/media/8a6988f1b10965ff1ba2a.png'},
    {name: 'Apple-pay', src: 'https://redvortex8.com/media/324ae302b1096876738ad.png'},
    {name: 'Google-pay', src: 'https://redvortex8.com/media/a3049712b109689356301.png'},
    {name: 'virgin-money', src: 'https://redvortex8.com/media/2fed1422b1096cb1271bb.png'},
  ];

  const responsibleItems = [
    {name: '18+ Play Responsibly', src: 'https://redvortex8.com/media/acaa22e5b10961b3cca34.png'},
    {name: 'eCOGRA', src: 'https://redvortex8.com/media/05c6bdf5b1096f423907f.png'},
    {name: 'Gambling Help Online', src: 'https://redvortex8.com/media/aa0f1116b109627b09564.png'},
    {name: 'Gambling Therapy', src: 'https://redvortex8.com/media/6fe2dc16b1096342d8619.png'},
  ];

  return (
    <div className={styles.partnershipFooter}>
      {/* License & Certificate - Mobile */}
      <div className={`${styles.paymentSupportedContainer} ${styles.mobileVersion}`}>
        <h3 className={styles.gradientText}>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
            License And Certificate
            <img src="https://redvortex8.com/media/f85d5f92b109699ea5bf6.png" alt="Verified" style={{width: '20px', height: '20px'}} loading="lazy" />
          </span>
        </h3>
        <div className={styles.marqueeScrollWrapper}>
          <div className={styles.marqueeScrollTrack}>
            {[...licenseItems, ...licenseItems].map((item, idx) => (
              <div key={`license-mobile-${idx}`} className={styles.badgeSupport}>
                <img src={item.src} alt={item.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* License & Certificate - Desktop */}
      <div className={`${styles.paymentSupportedContainer} ${styles.desktopVersion}`}>
        <h3 className={styles.gradientText}>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
            License And Certificate
            <img src="https://redvortex8.com/media/810b8595b10966ac3f272.png" alt="Verified" style={{width: '20px', height: '20px'}} loading="lazy" />
          </span>
        </h3>
        <div className={styles.marqueeScrollWrapper}>
          <div className={styles.marqueeScrollTrack}>
            {[...licenseItems, ...licenseItems].map((item, idx) => (
              <div key={`license-desktop-${idx}`} className={styles.badgeSupport}>
                <img src={item.src} alt={item.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods - Mobile */}
      <div className={`${styles.paymentSupportedContainer} ${styles.mobileVersion}`}>
        <h3 className={styles.gradientText}>Available Payment Methods</h3>
        <div className={styles.marqueeScrollWrapper}>
          <div className={styles.marqueeScrollTrack}>
            {[...paymentItems, ...paymentItems].map((item, idx) => (
              <div key={`payment-mobile-${idx}`} className={styles.badgeSupport}>
                <img src={item.src} alt={item.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods - Desktop */}
      <div className={`${styles.paymentSupportedContainer} ${styles.desktopVersion}`}>
        <h3 className={styles.gradientText}>Available Payment Methods</h3>
        <div className={styles.marqueeScrollWrapper}>
          <div className={styles.marqueeScrollTrack}>
            {[...paymentItems, ...paymentItems].map((item, idx) => (
              <div key={`payment-desktop-${idx}`} className={styles.badgeSupport}>
                <img src={item.src} alt={item.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsible Gambling - Mobile */}
      <div className={`${styles.paymentSupportedContainer} ${styles.mobileVersion}`}>
        <h3 className={styles.gradientText}>Responsible Gambling</h3>
        <div className={styles.marqueeScrollWrapper}>
          <div className={styles.marqueeScrollTrack}>
            {[...responsibleItems, ...responsibleItems, ...responsibleItems].map((item, idx) => (
              <div key={`responsible-mobile-${idx}`} className={styles.badgeSupport}>
                <img src={item.src} alt={item.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsible Gambling - Desktop */}
      <div className={`${styles.paymentSupportedContainer} ${styles.desktopVersion}`}>
        <h3 className={styles.gradientText}>Responsible Gambling</h3>
        <div className={styles.marqueeScrollWrapper}>
          <div className={styles.marqueeScrollTrack}>
            {[...responsibleItems, ...responsibleItems, ...responsibleItems].map((item, idx) => (
              <div key={`responsible-desktop-${idx}`} className={styles.badgeSupport}>
                <img src={item.src} alt={item.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}