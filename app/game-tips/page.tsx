'use client';

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { AnimatedSection } from "../components/AnimatedSection";

interface Game {
  title: string;
  rtp: string;
  thumbnail?: string;
  provider: string;
}

const GAMES_PER_PAGE = 60;

export default function GameTipsPage() {
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);

  // 检查滚动状态
  const checkScrollability = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 滚动到左侧
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // 滚动到右侧
  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // 获取提供商列表
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/games?action=providers");
        const data = await response.json();
        if (data.providers && Array.isArray(data.providers) && data.providers.length > 0) {
          setProviders(data.providers);
          if (!selectedProvider) {
            setSelectedProvider(data.providers[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        setError("Unable to load game providers list");
      }
    };
    fetchProviders();
  }, []);

  // 监听滚动和窗口大小变化
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      checkScrollability();
      tabsElement.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);

      return () => {
        tabsElement.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [providers]);

  // 当选择提供商时，加载该提供商的游戏
  useEffect(() => {
    if (selectedProvider) {
      loadProviderGames(selectedProvider);
    } else {
      setAllGames([]);
      setCurrentPage(1);
    }
  }, [selectedProvider]);

  const loadProviderGames = async (provider: string) => {
    setLoading(true);
    setError("");
    setAllGames([]);
    setCurrentPage(1);

    try {
      const response = await fetch(
        `/api/games?action=games&provider=${encodeURIComponent(provider)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Unable to load game data");
        return;
      }

      const data = await response.json();
      if (data.games && Array.isArray(data.games)) {
        setAllGames(data.games);
      } else {
        setError("Unable to get game data");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE);
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
  const endIndex = startIndex + GAMES_PER_PAGE;
  const currentGames = allGames.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getRtpColor = (percentage: number): string => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    const hue = (clampedPercentage / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.wrap}>
          <div className={styles.heroContainer}>
            <AnimatedSection animation="fadeInUp">
              <h1 className={styles.pageTitle}>Game Tips</h1>
              <p className={styles.pageSubtitle}>
                Explore RTP (Return to Player) information for games from various providers.
                Select a provider below to view their game collection.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <AnimatedSection animation="fadeInUp" delay={100}>
            <div className={styles.providerSection}>
              <div
                className={`${styles.providerTabsWrapper} ${
                  canScrollLeft ? styles.hasScrollLeft : ""
                } ${canScrollRight ? styles.hasScrollRight : ""}`}
              >
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`${styles.scrollButton} ${
                    !canScrollLeft ? styles.scrollButtonDisabled : ""
                  }`}
                  aria-label="Scroll left"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <div className={styles.providerTabs} ref={tabsRef}>
                  {providers.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setSelectedProvider(provider)}
                      className={`${styles.providerTab} ${
                        selectedProvider === provider ? styles.providerTabActive : ""
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`${styles.scrollButton} ${
                    !canScrollRight ? styles.scrollButtonDisabled : ""
                  }`}
                  aria-label="Scroll right"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {selectedProvider && (
                <div className={styles.providerHeader}>
                  <h2 className={styles.providerTitle}>{selectedProvider} RTP</h2>
                </div>
              )}
            </div>
          </AnimatedSection>

          {loading && (
            <AnimatedSection animation="fadeInUp">
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Loading games...</p>
              </div>
            </AnimatedSection>
          )}

          {error && (
            <AnimatedSection animation="fadeInUp">
              <div className={styles.errorState}>
                <p className={styles.errorTitle}>Error</p>
                <p className={styles.errorText}>{error}</p>
              </div>
            </AnimatedSection>
          )}

          {!loading && allGames.length > 0 && (
            <>
              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className={styles.pageInfo}>
                  <p className={styles.gameCount}>
                    Found <span className={styles.gameCountNumber}>{allGames.length}</span> games
                  </p>

                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                      >
                        Previous Page
                      </button>

                      <span className={styles.paginationInfo}>
                        Page {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage >= totalPages}
                        className={styles.paginationButton}
                      >
                        Next Page
                      </button>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              <div className={styles.gamesGrid}>
                {currentGames.map((game, index) => {
                  const rtpValue = game.rtp
                    ? parseFloat(game.rtp.replace("%", ""))
                    : 0;
                  const rtpPercentage = isNaN(rtpValue) ? 0 : rtpValue;

                  return (
                    <AnimatedSection
                      key={`${game.title}-${startIndex + index}`}
                      animation="scaleIn"
                      delay={index % 20 * 50}
                    >
                      <div className={styles.gameCard}>
                        {game.thumbnail && (
                          <div className={styles.gameThumbnail}>
                            <img
                              src={game.thumbnail}
                              alt={game.title}
                              className={styles.gameImage}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className={styles.gameContent}>
                          <h3 className={styles.gameTitle}>{game.title}</h3>
                          <div className={styles.gameRtp}>
                            <div className={styles.rtpBar}>
                              <div
                                className={styles.rtpBarFill}
                                style={{
                                  width: `${Math.min(rtpPercentage, 100)}%`,
                                  backgroundColor: getRtpColor(rtpPercentage),
                                }}
                              >
                                <span className={styles.rtpText}>
                                  RTP: {game.rtp || "N/A"}
                                </span>
                              </div>
                              {rtpPercentage < 30 && (
                                <span className={styles.rtpTextFallback}>
                                  RTP: {game.rtp || "N/A"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <AnimatedSection animation="fadeInUp">
                  <div className={styles.bottomPagination}>
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      ← Previous Page
                    </button>

                    <span className={styles.paginationInfo}>
                      Page {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage >= totalPages}
                      className={styles.paginationButton}
                    >
                      Next Page →
                    </button>
                  </div>
                </AnimatedSection>
              )}
            </>
          )}

          {!loading && !error && allGames.length === 0 && selectedProvider && (
            <AnimatedSection animation="fadeInUp">
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>No games found</p>
                <p className={styles.emptySubtext}>Please try selecting a different provider</p>
              </div>
            </AnimatedSection>
          )}

          {!loading && !error && allGames.length === 0 && !selectedProvider && (
            <AnimatedSection animation="fadeInUp">
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>Please select a game provider</p>
                <p className={styles.emptySubtext}>
                  Choose a provider from the tabs above to view their game collection
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}
