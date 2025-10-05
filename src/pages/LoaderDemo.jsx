import { useState } from "react";
import { useLoader } from "../hooks/useLoaderStore.jsx";
import { motion } from "framer-motion";
import styles from "./LoaderDemo.module.css";

/**
 * LoaderDemo - Demo page for testing GlobalLoader
 * Shows all variants and use cases
 */
const LoaderDemo = () => {
  const { showLoader, hideLoader, updateMessage, withLoader } = useLoader();
  const [result, setResult] = useState("");

  // Demo functions
  const demoDefault = () => {
    showLoader("Loading...", "default");
    setTimeout(hideLoader, 3000);
  };

  const demoPlanning = () => {
    showLoader("Creating your perfect journey...", "planning");
    setTimeout(hideLoader, 3000);
  };

  const demoSearching = () => {
    showLoader("Searching destinations...", "searching");
    setTimeout(hideLoader, 3000);
  };

  const demoGenerating = () => {
    showLoader("AI is planning your trip...", "generating");
    setTimeout(hideLoader, 3000);
  };

  const demoProgressiveMessages = async () => {
    showLoader("Starting...", "planning");

    await new Promise((r) => setTimeout(r, 1000));
    updateMessage("Analyzing preferences...");

    await new Promise((r) => setTimeout(r, 1000));
    updateMessage("Generating itinerary...");

    await new Promise((r) => setTimeout(r, 1000));
    updateMessage("Finalizing your trip...");

    await new Promise((r) => setTimeout(r, 1000));
    hideLoader();
  };

  const demoWithWrapper = async () => {
    const data = await withLoader(
      async () => {
        await new Promise((r) => setTimeout(r, 2000));
        return "Data loaded successfully! ✅";
      },
      "Loading data with wrapper...",
      "default"
    );
    setResult(data);
  };

  return (
    <div className={styles.demoPage}>
      <div className={styles.container}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎨 Global Loader Demo
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Test different loader variants with vacation-themed bouncing emojis
        </motion.p>

        {/* Variant Demos */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🎭 Variants</h2>
          <div className={styles.buttonGrid}>
            <motion.button
              className={`${styles.demoButton} ${styles.default}`}
              onClick={demoDefault}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonEmoji}>💙</span>
              <span className={styles.buttonText}>Default</span>
              <span className={styles.buttonDesc}>General loading</span>
            </motion.button>

            <motion.button
              className={`${styles.demoButton} ${styles.planning}`}
              onClick={demoPlanning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonEmoji}>💜</span>
              <span className={styles.buttonText}>Planning</span>
              <span className={styles.buttonDesc}>Trip planning</span>
            </motion.button>

            <motion.button
              className={`${styles.demoButton} ${styles.searching}`}
              onClick={demoSearching}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonEmoji}>🔍</span>
              <span className={styles.buttonText}>Searching</span>
              <span className={styles.buttonDesc}>Location search</span>
            </motion.button>

            <motion.button
              className={`${styles.demoButton} ${styles.generating}`}
              onClick={demoGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonEmoji}>🤖</span>
              <span className={styles.buttonText}>Generating</span>
              <span className={styles.buttonDesc}>AI generation</span>
            </motion.button>
          </div>
        </div>

        {/* Advanced Demos */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🚀 Advanced</h2>
          <div className={styles.buttonGrid}>
            <motion.button
              className={`${styles.demoButton} ${styles.progressive}`}
              onClick={demoProgressiveMessages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonEmoji}>📝</span>
              <span className={styles.buttonText}>Progressive Messages</span>
              <span className={styles.buttonDesc}>
                Updates message dynamically
              </span>
            </motion.button>

            <motion.button
              className={`${styles.demoButton} ${styles.wrapper}`}
              onClick={demoWithWrapper}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonEmoji}>🎁</span>
              <span className={styles.buttonText}>withLoader Wrapper</span>
              <span className={styles.buttonDesc}>Async function wrapper</span>
            </motion.button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <motion.div
            className={styles.result}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className={styles.resultText}>{result}</p>
          </motion.div>
        )}

        {/* Features Info */}
        <div className={styles.features}>
          <h2 className={styles.sectionTitle}>✨ Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✈️🌴🏖️</span>
              <h3>Vacation Emojis</h3>
              <p>5 themed emojis bouncing in sequence</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔮</span>
              <h3>Glassmorphism</h3>
              <p>Frosted glass backdrop blur effect</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💫</span>
              <h3>Spring Physics</h3>
              <p>Natural animations with easing</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🌓</span>
              <h3>Dark Mode</h3>
              <p>Automatic dark mode support</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📱</span>
              <h3>Responsive</h3>
              <p>Adapts to mobile & desktop</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>♿</span>
              <h3>Accessible</h3>
              <p>Respects reduced-motion</p>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className={styles.codeSection}>
          <h2 className={styles.sectionTitle}>💻 Usage Example</h2>
          <pre className={styles.codeBlock}>
            {`import { useLoader } from '@/hooks/useLoaderStore';

function MyComponent() {
  const { showLoader, hideLoader } = useLoader();
  
  const handleAction = async () => {
    showLoader('Loading...', 'default');
    await fetchData();
    hideLoader();
  };
  
  return <button onClick={handleAction}>Load</button>;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
