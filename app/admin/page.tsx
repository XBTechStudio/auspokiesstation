"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 1000);


    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  const quickActions = [
    {
      title: "Brands",
      description: "Manage Register Now links for all brands",
      href: "/admin/brands",
      icon: "brands",
      color: "#059669",
    },
    {
      title: "Settings",
      description: "Configure site settings, content, and logos",
      href: "/admin/settings",
      icon: "settings",
      color: "#6B46C1",
    },
  ];

  const formattedDate = currentTime.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <div className={styles.greetingSection}>
            <span className={styles.greeting}>{greeting}!</span>
            <h1 className={styles.welcomeTitle}>Welcome Back</h1>
          </div>
        </div>
        <div className={styles.clockWidget}>
          <div className={styles.clockContainer}>
            <div className={styles.clockTime}>{formattedTime}</div>
            <div className={styles.clockDate}>{formattedDate}</div>
          </div>
        </div>
      </div>


      <div className={styles.quickActionsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <p className={styles.sectionSubtitle}>Manage your site content</p>
        </div>
        <div className={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={styles.actionCard}
            >
              <div className={styles.actionCardInner}>
                <div className={styles.actionIcon} style={{ background: `${action.color}15`, borderColor: `${action.color}30` }}>
                  {action.icon === "brands" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {action.icon === "bonus" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="8" width="18" height="4" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {action.icon === "testimonials" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {action.icon === "announcements" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {action.icon === "settings" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className={styles.actionContent}>
                  <h3 className={styles.actionTitle}>{action.title}</h3>
                  <p className={styles.actionDescription}>{action.description}</p>
                </div>
                <div className={styles.actionArrow}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
