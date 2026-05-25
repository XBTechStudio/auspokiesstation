"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip auth check if already checked or on login page
    if (hasCheckedAuth || pathname === "/admin/login") {
      return;
    }

    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        if (pathname !== "/admin/login" && isMounted) {
          router.push("/admin/login");
        }
        if (isMounted) {
          setIsAuthenticated(false);
          setHasCheckedAuth(true);
        }
        return;
      }

      try {
        const response = await fetch("/api/admin/auth", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON, got ${contentType}`);
        }

        const data = await response.json();

        if (isMounted) {
          setHasCheckedAuth(true);
          if (response.ok && data.authenticated) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("admin_token");
            if (pathname !== "/admin/login") {
              router.push("/admin/login");
            }
            setIsAuthenticated(false);
          }
        }
      } catch (error: any) {
        console.error("Auth check error:", error);
        if (isMounted) {
          setHasCheckedAuth(true);
          localStorage.removeItem("admin_token");
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === false) {
    return null;
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/brands", label: "Brands", icon: "brands" },
    { href: "/admin/settings", label: "Settings", icon: "settings" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className={styles.adminContainer}>
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            <span className={styles.logoText}>88 × WILD</span>
            <span className={styles.logoSubtext}>ADMIN</span>
          </Link>
          <button
            className={styles.sidebarToggle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M3 12h18M3 6h18M3 18h18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>
                {item.icon === "dashboard" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "brands" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "bonus" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="8" width="18" height="4" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8v13M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "testimonials" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "announcements" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {item.icon === "settings" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              router.push("/admin/login");
            }}
            className={styles.logoutButton}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
          <Link href="/" className={styles.backToSite}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      <main 
        className={`${styles.mainContent} ${!isSidebarOpen ? styles.mainContentExpanded : ""}`}
      >
        {!isSidebarOpen && (
          <button
            className={styles.floatingMenuButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSidebarOpen(true);
            }}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M3 12h18M3 6h18M3 18h18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
