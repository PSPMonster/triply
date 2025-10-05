import { motion, useScroll, useTransform } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MapPin, Clock, DollarSign, Leaf, Volume2, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { mockTrips } from "../data/mockTrips";
import { Header, TripHero } from "../components";
import styles from "./TripView.module.css";

const TripView = () => {
  const { cityId } = useParams(); // Get city from URL: /trip/lisbon
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood || "relax"; // Get mood from navigation state

  const trip = mockTrips[cityId];
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const dayTabsRef = useRef(null);
  const contentRef = useRef(null);
  const [layoutSpacing, setLayoutSpacing] = useState({
    stickySpacing: 160,
    timelinePadding: 112,
  });

  // 📜 Track scroll position for dynamic spacing
  const { scrollY } = useScroll();

  // 🎨 Dynamic spacing above timeline - appears when Hero collapses
  // Synced with Hero collapse threshold (120px)
  const heroCollapseProgress = useTransform(
    scrollY,
    [0, 120, 180],
    [0, 0.5, 1]
  );
  const timelinePaddingTop = useTransform(heroCollapseProgress, (value) => {
    const targetPadding = layoutSpacing.timelinePadding;
    return `${targetPadding * value}px`;
  });

  // 📏 Measure sticky header, tabs, and content padding to compute spacing offsets
  useEffect(() => {
    const calculateSpacing = () => {
      const headerEl = document.querySelector('[data-role="app-header"]');
      const headerHeight = headerEl?.offsetHeight ?? 64;
      const tabsHeight = dayTabsRef.current?.offsetHeight ?? 0;
      const contentPaddingTop = contentRef.current
        ? parseFloat(
            window.getComputedStyle(contentRef.current).paddingTop || "0"
          )
        : 0;
      const breathingSpace = window.innerWidth <= 768 ? 32 : 48;

      const stickySpacing = headerHeight + tabsHeight + breathingSpace;
      const timelinePadding = Math.max(stickySpacing - contentPaddingTop, 0);

      setLayoutSpacing({ stickySpacing, timelinePadding });
    };

    calculateSpacing();
    window.addEventListener("resize", calculateSpacing);
    return () => window.removeEventListener("resize", calculateSpacing);
  }, [cityId]);

  // 🎯 Smooth scroll to first activity when day changes
  // Apple-like: gentle navigation, respects sticky elements
  // Only triggers on user interaction (not on mount)
  useEffect(() => {
    // Skip on initial render (selectedDay starts at 0)
    if (selectedDay === 0) return;

    // Find first activity of selected day
    const firstActivity = document.querySelector(".activityCard");
    if (firstActivity) {
      // Smooth scroll with proper offset for sticky header + tabs
      setTimeout(() => {
        firstActivity.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200); // Small delay for tab animation to complete
    }
  }, [selectedDay]);

  // 🚫 404 Handling - Invalid city ID
  if (!trip) {
    return (
      <motion.div
        className={styles.notFound}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>Trip not found</h1>
        <p>The city "{cityId}" doesn't exist in our database.</p>
        <button onClick={() => navigate("/explore")}>
          Explore Destinations
        </button>
      </motion.div>
    );
  }

  const currentDay = trip.days[selectedDay];

  return (
    <motion.div
      className={styles.tripView}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Universal Header - shows city name on scroll */}
      <Header
        onBack={() => navigate("/explore")}
        title={trip.city}
        subtitle={trip.tagline}
        transparent={true}
      />

      {/* Hero Section - fades out on scroll */}
      <TripHero trip={trip} />

      {/* Day Tabs */}
      <div className={styles.dayTabs} ref={dayTabsRef}>
        <div className={styles.tabsContainer}>
          {trip.days.map((day, index) => (
            <motion.button
              key={index}
              className={`${styles.dayTab} ${
                selectedDay === index ? styles.activeTab : ""
              }`}
              onClick={() => {
                setSelectedDay(index);
                setSelectedActivity(null);
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.dayNumber}>Day {day.day}</span>
              <span className={styles.dayTheme}>{day.theme}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className={styles.content} ref={contentRef}>
        <motion.div
          className={styles.timeline}
          style={{ paddingTop: timelinePaddingTop }}
        >
          {currentDay.activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className={`activityCard ${styles.activityCard} ${
                selectedActivity === activity.id ? styles.selectedActivity : ""
              }`}
              style={{ scrollMarginTop: `${layoutSpacing.stickySpacing}px` }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={() => setSelectedActivity(activity.id)}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.activityTime}>
                <Clock size={16} />
                <span>{activity.time}</span>
                <span className={styles.duration}>({activity.duration})</span>
              </div>

              <div className={styles.activityMain}>
                <div className={styles.activityImage}>
                  <img src={activity.image} alt={activity.name} />
                </div>

                <div className={styles.activityInfo}>
                  <h3 className={styles.activityName}>{activity.name}</h3>
                  <p className={styles.activityDescription}>
                    {activity.description}
                  </p>

                  <div className={styles.emotionalNote}>
                    <Heart size={14} />
                    <em>{activity.emotionalNote}</em>
                  </div>

                  <div className={styles.activityDetails}>
                    <span className={styles.detail}>
                      <MapPin size={14} />
                      {activity.transport}
                    </span>
                    <span className={styles.detail}>
                      <Volume2 size={14} />
                      Noise: {activity.noiseLevel}%
                    </span>
                    {activity.cost > 0 && (
                      <span className={styles.detail}>
                        <DollarSign size={14} />${activity.cost}
                      </span>
                    )}
                    {activity.ecoFriendly && (
                      <span className={`${styles.detail} ${styles.ecoTag}`}>
                        <Leaf size={14} />
                        Eco-friendly
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Panel */}
        <motion.div
          className={styles.summaryPanel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.summaryTitle}>Day {currentDay.day} Overview</h3>

          <div className={styles.summaryStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Activities</span>
              <span className={styles.statValue}>
                {currentDay.activities.length}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Cost</span>
              <span className={styles.statValue}>
                ${currentDay.activities.reduce((sum, a) => sum + a.cost, 0)}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Avg Noise</span>
              <span className={styles.statValue}>
                {Math.round(
                  currentDay.activities.reduce(
                    (sum, a) => sum + a.noiseLevel,
                    0
                  ) / currentDay.activities.length
                )}
                %
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Eco Score</span>
              <span className={styles.statValue}>
                {Math.round(
                  (currentDay.activities.filter((a) => a.ecoFriendly).length /
                    currentDay.activities.length) *
                    100
                )}
                %
              </span>
            </div>
          </div>

          <div className={styles.summaryNote}>
            <Heart size={20} />
            <p>
              This itinerary is designed for your peace of mind. Take your time,
              be present, and enjoy each moment.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TripView;
