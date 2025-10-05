import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Leaf, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./TripHero.module.css";

const TripHero = ({ trip }) => {
  const { scrollY } = useScroll();
  const scrollTimeoutRef = useRef(null);
  const [isMomentumEnabled, setIsMomentumEnabled] = useState(false);

  /**
   * 🎬 HERO COLLAPSE ANIMATION SYSTEM
   *
   * Problem: Empty space remained when hero content faded out
   * Solution: Multi-layered collapse inspired by iOS Safari
   *
   * Animation Stages (Mobile-Optimized):
   * ┌─────────────────────────────────────────────────────────┐
   * │ Scroll:  0px   →   120px   →   180px   →   200px       │
   * ├─────────────────────────────────────────────────────────┤
   * │ Height:  800px →   200px   →   160px   →   120px       │
   * │ Content: 1.0   →   0.5     →   0.0     →   (hidden)    │
   * │ Padding: 3rem  →   1.5rem  →   0rem    →   0rem        │
   * │ Parallax: 0px  →   -40px   →   -70px   →   -80px       │
   * └─────────────────────────────────────────────────────────┘
   * Mobile UX: Hero stops at 120px (not 0) - prevents skipping first activity
   *
   * Key: Content fades BEFORE hero collapses (prevents flickering)
   */

  // Parallax effect - hero moves 32% slower than scroll (80/250)
  // Creates depth illusion, premium iOS-like feel
  const heroY = useTransform(scrollY, [0, 250], [0, -80]);

  // Three-stage fade: visible → translucent → invisible
  // Ensures content is gone before collapse completes
  const contentOpacity = useTransform(scrollY, [0, 120, 180], [1, 0.5, 0]);

  // Subtle scale-down adds depth perception (Ken Burns micro-effect)
  const contentScale = useTransform(scrollY, [0, 180], [1, 0.92]);

  // Hero height collapse - Mobile-friendly version
  // Stops at 120px (mini-header) instead of 0px - keeps context visible
  // User won't accidentally skip first activity on mobile
  const heroMaxHeight = useTransform(
    scrollY,
    [0, 100, 200],
    ["800px", "200px", "120px"]
  );

  // Padding compression synchronized with height reduction
  // Creates seamless "accordion collapse" effect
  const heroPaddingTop = useTransform(
    scrollY,
    [0, 120, 180],
    ["calc(64px + 3rem)", "calc(64px + 1rem)", "0px"]
  );

  const heroPaddingBottom = useTransform(
    scrollY,
    [0, 120, 180],
    ["3rem", "1.5rem", "0px"]
  );

  // ⏱️ Delay momentum completion to allow initial scroll reset
  // Prevents interference with App.jsx scroll reset on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMomentumEnabled(true);
    }, 800); // Wait 800ms after mount before enabling momentum

    return () => clearTimeout(timer);
  }, []);

  // 🎯 Smooth scroll completion - prevents mid-animation freeze
  // iOS-like: if user stops scrolling mid-collapse, gently complete animation
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // Skip momentum if not yet enabled (during initial load)
      if (!isMomentumEnabled) return;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // If stopped mid-collapse (50-190px range), complete the animation
      if (latest > 50 && latest < 190) {
        scrollTimeoutRef.current = setTimeout(() => {
          // Determine nearest endpoint: < 120px → scroll to 0, >= 120px → scroll to 220
          const targetScroll = latest < 120 ? 0 : 220;

          window.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        }, 150); // Wait 150ms of idle before completing
      }
    });

    return () => {
      unsubscribe();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollY, isMomentumEnabled]);

  return (
    <motion.div
      className={styles.hero}
      style={{
        y: heroY,
        maxHeight: heroMaxHeight,
        paddingTop: heroPaddingTop,
        paddingBottom: heroPaddingBottom,
      }}
    >
      <motion.div
        className={styles.heroContent}
        style={{
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        {/* Main Title - fades out elegantly */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className={styles.title}>{trip.city}</h1>
          <p className={styles.tagline}>{trip.tagline}</p>
        </motion.div>

        {/* Meta Info - staggered animation */}
        <motion.div
          className={styles.metaInfo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <MetaCard
            icon={<Clock size={18} />}
            label="Duration"
            value={trip.duration}
            delay={0.5}
          />
          <MetaCard
            icon={<Leaf size={18} />}
            label="Eco Score"
            value={`${trip.ecoScore}%`}
            delay={0.6}
          />
          <MetaCard
            icon={<Heart size={18} />}
            label="Stress Level"
            value={trip.stressLevel}
            delay={0.7}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const MetaCard = ({ icon, label, value, delay }) => (
  <motion.div
    className={styles.metaCard}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{
      scale: 1.05,
      transition: { duration: 0.2 },
    }}
  >
    <div className={styles.metaIcon}>{icon}</div>
    <div className={styles.metaText}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  </motion.div>
);

export default TripHero;
