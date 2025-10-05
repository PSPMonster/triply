import { motion, AnimatePresence } from "framer-motion";
import styles from "./GlobalLoader.module.css";

/**
 * GlobalLoader - Apple-like loading animation with vacation emojis
 *
 * Features:
 * - Bouncing emoji sequence (Uber Eats style)
 * - Glassmorphism backdrop
 * - Smooth fade in/out
 * - Configurable loading messages
 * - Spring physics animations
 *
 * @param {boolean} isLoading - Show/hide loader
 * @param {string} message - Optional loading message
 * @param {string} variant - "default" | "planning" | "searching"
 */
const GlobalLoader = ({
  isLoading = false,
  message = "Loading...",
  variant = "default",
}) => {
  // Vacation-themed emojis that bounce in sequence
  const emojis = ["✈️", "🌴", "🏖️", "🗺️", "🎒"];

  // Different messages for different contexts
  const messages = {
    default: "Loading...",
    planning: "Creating your perfect journey...",
    searching: "Searching destinations...",
    generating: "AI is planning your trip...",
  };

  const displayMessage = messages[variant] || message;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Glassmorphism backdrop */}
          <motion.div
            className={styles.loaderBackdrop}
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          />

          {/* Loader content */}
          <motion.div
            className={styles.loaderContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Bouncing emojis */}
            <div className={styles.emojiContainer}>
              {emojis.map((emoji, index) => (
                <motion.div
                  key={index}
                  className={styles.emoji}
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>

            {/* Loading message */}
            <motion.p
              className={styles.loaderMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {displayMessage}
            </motion.p>

            {/* Subtle pulsing dots */}
            <div className={styles.dotsContainer}>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className={styles.dot}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Optional: Spinning circle (subtle, Apple-style) */}
            <motion.div
              className={styles.spinnerRing}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
