import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Compass, Sparkles, Heart, Leaf } from "lucide-react";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // 🔍 Debug: Monitor video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const logEvent = (eventName) => {
      console.log(`🎬 Video ${eventName}:`, {
        readyState: video.readyState,
        networkState: video.networkState,
        paused: video.paused,
        duration: video.duration,
        currentTime: video.currentTime,
      });
    };

    video.addEventListener("loadstart", () => logEvent("loadstart"));
    video.addEventListener("loadeddata", () => logEvent("loadeddata"));
    video.addEventListener("canplay", () => logEvent("canplay"));
    video.addEventListener("playing", () => logEvent("playing"));
    video.addEventListener("error", (e) => {
      console.error("🚨 Video error:", video.error);
    });

    // Force play attempt
    video.play().catch((err) => {
      console.warn("⚠️ Autoplay blocked:", err.message);
    });
  }, []);
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Video - Subtle, Apple-like */}
        <div className={styles.videoBackground}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={styles.heroVideo}
            // poster="/assets/video-poster.jpg"
            aria-hidden="true"
          >
            <source src="/assets/bg_video.mp4" type="video/mp4" />
            {/* Fallback message for unsupported browsers */}
            Your browser doesn't support video backgrounds.
          </video>
          {/* Multi-layer overlay for perfect text legibility */}
          <div className={styles.videoOverlay} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={styles.heroContent}
        >
          <div className={styles.logo}>
            <Compass size={48} strokeWidth={1.5} />
          </div>

          <h1 className={styles.title}>Triply</h1>

          <p className={styles.tagline}>Plan less. Travel more.</p>

          <p className={styles.subtitle}>
            AI-powered calm travel. Your journey, simplified.
          </p>

          <motion.button
            className={styles.ctaButton}
            onClick={() => navigate("/explore")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Journey
          </motion.button>
        </motion.div>

        {/* Floating elements for visual interest */}
        <motion.div
          className={styles.floatingIcon}
          style={{ top: "20%", left: "15%" }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={24} opacity={0.3} />
        </motion.div>

        <motion.div
          className={styles.floatingIcon}
          style={{ top: "60%", right: "20%" }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={24} opacity={0.3} />
        </motion.div>

        <motion.div
          className={styles.floatingIcon}
          style={{ bottom: "15%", left: "25%" }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf size={24} opacity={0.3} />
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className={styles.features}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className={styles.featureGrid}>
          <FeatureCard
            icon={<Sparkles size={28} />}
            title="AI-Powered"
            description="Personalized itineraries based on your mood and energy"
            delay={0.8}
          />
          <FeatureCard
            icon={<Heart size={28} />}
            title="Stress-Free"
            description="Navigate with calm confidence, no overwhelm"
            delay={0.9}
          />
          <FeatureCard
            icon={<Leaf size={28} />}
            title="Eco-Conscious"
            description="Sustainable choices that respect the planet"
            delay={1.0}
          />
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    className={styles.featureCard}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
  >
    <div className={styles.featureIcon}>{icon}</div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
  </motion.div>
);

export default LandingPage;
