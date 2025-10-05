import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

const Header = ({
  onBack,
  showBackButton = true,
  title = "",
  subtitle = "",
  transparent = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // Trigger when scrolled past 100px (after hero section)
      setIsScrolled(latest > 100);
    });

    return () => unsubscribe();
  }, [scrollY]);

  // Smooth opacity transition for title
  const titleOpacity = useTransform(scrollY, [80, 120], [0, 1]);
  const titleY = useTransform(scrollY, [80, 120], [10, 0]);

  return (
    <motion.header
      className={`${styles.header} ${
        transparent && !isScrolled ? styles.transparent : ""
      }`}
      data-role="app-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.headerContent}>
        {/* Left: Back Button */}
        {showBackButton && (
          <motion.button
            className={styles.backButton}
            onClick={onBack}
            whileHover={{
              x: -4,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} strokeWidth={2} />
            <span>Back</span>
          </motion.button>
        )}

        {/* Center: Dynamic Title (shows on scroll) */}
        <motion.div
          className={styles.centerTitle}
          style={{
            opacity: titleOpacity,
            y: titleY,
          }}
        >
          {title && (
            <motion.h2
              className={styles.scrollTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: isScrolled ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && isScrolled && (
            <motion.p
              className={styles.scrollSubtitle}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {/* Right: Placeholder for future actions */}
        <div className={styles.headerActions}>
          {/* Future: Share, Save, Menu buttons */}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
