"use client";

import { useState } from "react";
import { QuantumParticles, FloatingElements, ParallaxBackground, OrganicFlowBackground } from "../components/BackgroundEffects";
import { HolographicCard } from "../components/HolographicCard";
import { AnimatedSection } from "../components/AnimatedSection";
import { QuantumStatus } from "../components/QuantumStatus";
import { AITypingText } from "../components/AITypingText";
import styles from "./page.module.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
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
                <span>Contact Us</span>
                <div className={styles.titleGlow}></div>
              </h1>
              <p className={styles.heroSubtitle}>
                <AITypingText
                  text="Have a question? We'd love to hear from you."
                  speed={30}
                />
              </p>
            </AnimatedSection>
          </div>
        </section>

        <AnimatedSection animation="scaleIn">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Get In Touch</h2>
            <p className={styles.sectionSubtitle}>We're here to help you 24/7</p>
          </div>
        </AnimatedSection>

        <div className={styles.contactContainer}>
          {/* Contact Info Grid */}
          <div className={styles.infoGrid}>
            <AnimatedSection animation="fadeInUp" delay={100}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📱</div>
                <h3>Telegram</h3>
                <p>Join our active community for instant support</p>
                <a href="https://t.me/AusPokiesStation" target="_blank" className={styles.infoLink}>@AusPokiesStation</a>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={200}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>💬</div>
                <h3>WhatsApp</h3>
                <p>Direct messaging for quick responses</p>
                <a href="https://chat.whatsapp.com/FzBYah59mJPCfWRf7xVdhO" target="_blank" className={styles.infoLink}>Join Group</a>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={300}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>✉️</div>
                <h3>Email</h3>
                <p>For formal inquiries and partnerships</p>
                <a href="mailto:88grouppartnership@gmail.com" className={styles.infoLink}>88grouppartnership@gmail.com</a>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={400}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🕒</div>
                <h3>Support Hours</h3>
                <p>We're available around the clock</p>
                <span className={styles.infoStatus}>24/7 Support</span>
              </div>
            </AnimatedSection>
          </div>

          <div className={styles.formSection}>
            <AnimatedSection animation="fadeInUp">
              <div className={styles.sectionHeaderSmall}>
                <h2 className={styles.sectionTitleSmall}>Send Us a Message</h2>
              </div>
              <div className={styles.contactForm}>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Your Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      value={formData.subject}
                      className={styles.formSelect}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Bonus Question">Bonus Question</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership Inquiry">Partnership Inquiry</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      placeholder="Your Message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  {status === "success" && (
                    <div className={styles.successMessage}>
                      <span className={styles.msgIcon}>✓</span>
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}
                  {status === "error" && (
                    <div className={styles.errorMessage}>
                      <span className={styles.msgIcon}>!</span>
                      Sorry, there was an error sending your message. Please try again.
                    </div>
                  )}
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === "sending"}
                  >
                    <span className={styles.btnText}>
                      {status === "sending" ? "Sending..." : "Send Message"}
                    </span>
                    <div className={styles.btnGlow}></div>
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>

          {/* Socials & Links Section */}
          <div className={styles.footerGrids}>
            <AnimatedSection animation="fadeInUp" delay={200}>
              <div className={styles.linksSection}>
                <h3>Our Socials</h3>
                <p>Your trusted partner in online gaming experience</p>
                <div className={styles.socialButtons}>
                  <a href="https://chat.whatsapp.com/FzBYah59mJPCfWRf7xVdhO" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>Whatsapp Channel</a>
                  <a href="#" className={styles.socialBtn}>Telegram Channel</a>
                  <a href="#" className={styles.socialBtn}>Feedback Docs</a>
                  <a href="#" className={styles.socialBtn}>Complaint Hotline</a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={400}>
              <div className={styles.linksSection}>
                <h3>Quick Links</h3>
                <div className={styles.quickLinksGrid}>
                  <a href="/faq" className={styles.quickLinkItem}>
                    <strong>FAQ</strong>
                    <span>Find answers to common questions</span>
                  </a>
                  <a href="/partner-casinos" className={styles.quickLinkItem}>
                    <strong>Partner Casinos</strong>
                    <span>Browse our trusted partners</span>
                  </a>
                  <a href="/bonuses-promotions" className={styles.quickLinkItem}>
                    <strong>Bonuses</strong>
                    <span>View available promotions</span>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
