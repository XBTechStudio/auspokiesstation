"use client";

import { useState } from "react";
import { QuantumParticles, FloatingElements, ParallaxBackground, OrganicFlowBackground } from "../components/BackgroundEffects";
import { HolographicCard } from "../components/HolographicCard";
import { AnimatedSection } from "../components/AnimatedSection";
import { QuantumStatus } from "../components/QuantumStatus";
import { AITypingText } from "../components/AITypingText";
import styles from "./page.module.css";

type FAQItem = {
  question: string;
  answer: string | string[];
  source?: 'wildgroup' | '88group';
};

const faqs: FAQItem[] = [
  {
    question: "What is 88 GROUP × WILD GROUP PARTNERSHIP?",
    answer: "AUS Pokies Station is a collective network of premium online gaming brands, connecting players to reliable platforms designed for different preferences and play styles. It combines the strengths of WildGroup and 88 Group to deliver Australia's premier gaming experience.",
  },
  {
    question: "Is 88 GROUP × WILD GROUP PARTNERSHIP a casino?",
    answer: "No. AUS Pokies Station is not a casino and does not operate, host, or control any games. All gameplay, deposits, and withdrawals are handled directly by our partner casinos.",
  },
  {
    question: "How do I join 88 GROUP × WILD GROUP PARTNERSHIP?",
    answer: "Joining is simple! Browse our partner casinos, select your preferred platform, and click 'Register Now'. Complete the quick sign-up process (usually under 3 minutes), verify your identity, and you're ready to play.",
  },
  {
    question: "Is 88 GROUP × WILD GROUP PARTNERSHIP licensed and safe?",
    answer: "Yes, all our partner casinos are fully licensed by recognized gaming authorities including PAGCOR and Curacao eGaming. We only partner with platforms that meet our strict standards for security, fair play, and player protection.",
  },
  {
    question: "What can I do on 88 GROUP × WILD GROUP PARTNERSHIP?",
    answer: [
      "Explore and compare partner casinos",
      "View platform announcements and updates",
      "Access partner promotions and events",
      "Join community channels for updates and support",
    ],
  },
  {
    question: "Do I need an 88 GROUP × WILD GROUP PARTNERSHIP account to play?",
    answer: "No account is required to play at any partner casino. Players may choose to follow AUS Pokies Station to receive updates, announcements, and exclusive partner information.",
  },
  {
    question: "Is 88 GROUP × WILD GROUP PARTNERSHIP free to use?",
    answer: "Yes. Accessing AUS Pokies Station and its content is completely free.",
  },
  {
    question: "Can I join multiple partner casinos?",
    answer: "Absolutely! You're free to register with as many of our partner casinos as you like. Each platform offers unique bonuses and game selections, so many players enjoy having accounts across multiple sites.",
  },
  {
    question: "How does 88 GROUP × WILD GROUP PARTNERSHIP select partner casinos?",
    answer: [
      "Platform stability and system performance",
      "Consistent withdrawal activity",
      "Player feedback and usage trends",
      "Long-term operational reliability",
    ],
  },
  {
    question: "What bonuses are available?",
    answer: "Our partners offer a variety of bonuses including welcome packages up to 200%, free registration credits ($50-$100), Plinko/Lucky Spin games with prizes up to $1,888, VIP programs, weekly cashback, and ongoing promotions.",
  },
  {
    question: "Are there wagering requirements?",
    answer: "Wagering requirements vary by casino and bonus type. Always check the specific terms and conditions for each offer. Some promotions, like certain free spin winnings, may have no wagering requirements.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "Our partners accept various payment methods including Visa/Mastercard, Australian bank transfers (Westpac, NAB, etc.), e-wallets (MiFinity, eZeeWallet), and cryptocurrencies (Bitcoin, Ethereum, USDT, BNB, and more).",
  },
  {
    question: "How fast are withdrawals?",
    answer: "Withdrawal speeds vary by method and casino. Cryptocurrency withdrawals are often instant, e-wallets within hours, and bank transfers 1-3 business days. VIP members enjoy priority processing.",
  },
  {
    question: "Can I withdraw or deposit directly through 88 GROUP × WILD GROUP PARTNERSHIP?",
    answer: "No. AUS Pokies Station does not process deposits or withdrawals. All transactions take place directly on the partner casino platforms.",
  },
  {
    question: "What games are available?",
    answer: "Our partners offer thousands of games including online pokies, live dealer games (blackjack, roulette, baccarat), table games, video poker, crash games, and specialty games like Plinko.",
  },
  {
    question: "Can I play on mobile?",
    answer: "Yes! All our partner casinos are fully optimized for mobile play. Access games directly through your mobile browser or download dedicated apps where available.",
  },
  {
    question: "Are the games fair?",
    answer: "Absolutely. All games use certified Random Number Generators (RNG) and are regularly audited by independent testing agencies like iTech Labs and BMM Testlabs.",
  },
  {
    question: "Is my information secure?",
    answer: "Yes, all partner casinos use SSL encryption and follow strict security protocols to protect your personal and financial information. Your information is never shared with third parties.",
  },
  {
    question: "What responsible gaming tools are available?",
    answer: "All our partners offer tools including deposit limits, loss limits, session time limits, cooling-off periods, and self-exclusion options. Contact support to set up any restrictions.",
  },
  {
    question: "Where can I get help for gambling problems?",
    answer: "If you or someone you know has a gambling problem, seek help from organizations like Gambling Help Online (www.gamblinghelponline.org.au) or call 1800 858 858.",
  },
  {
    question: "How can I contact 88 GROUP × WILD GROUP PARTNERSHIP?",
    answer: "You can reach us via the contact form on our website, community platforms such as Telegram or social media. For account or transaction issues, players should contact the relevant partner casino directly.",
  },
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const renderAnswer = (answer: string | string[]) => {
    if (Array.isArray(answer)) {
      return (
        <ul className={styles.answerList}>
          {answer.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className={styles.answerText}>{answer}</p>;
  };

  return (
    <div className={styles.page}>
      {/* Enhanced Parallax Background */}
      <ParallaxBackground />

      {/* Quantum Particle System Background */}
      <QuantumParticles />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Organic Flow Background */}
      <OrganicFlowBackground />
      
      <div className={styles.wrap}>
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <AnimatedSection animation="fadeIn">
              <QuantumStatus text="SYSTEM STATUS: OPERATIONAL" />
              <h1 className={styles.heroTitle}>
                <span>Frequently Asked Questions</span>
                <div className={styles.titleGlow}></div>
              </h1>
              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="Find answers to common questions about 88 GROUP × WILD GROUP PARTNERSHIP"
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>
        <AnimatedSection animation="scaleIn">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Common Questions</h2>
            <p className={styles.sectionSubtitle}>Find your answers here</p>
          </div>
        </AnimatedSection>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 50}>
              <div
                className={`${styles.faqItem} ${
                  expandedIndex === index ? styles.expanded : ""
                }`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <div className={styles.arrow}>+</div>
                </button>
                {expandedIndex === index && (
                  <div className={styles.faqAnswer}>
                    {renderAnswer(faq.answer)}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
