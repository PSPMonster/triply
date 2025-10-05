import { motion, useScroll, useTransform } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Utensils,
  Car,
  Camera,
  Star,
  Heart,
  AlertCircle,
  Hotel,
  Compass,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Header, TripHero } from "../components";
import styles from "./TripView.module.css";

/**
 * TripViewAI - Display AI-generated trip itinerary
 * Apple-like design matching original TripView aesthetic
 */
const TripViewAI = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get trip data from navigation state
  const { tripData, itinerary } = location.state || {};

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const dayTabsRef = useRef(null);
  const contentRef = useRef(null);
  const [layoutSpacing, setLayoutSpacing] = useState({
    stickySpacing: 160,
    timelinePadding: 112,
  });

  // 📜 Track scroll position for dynamic spacing
  const { scrollY } = useScroll();

  // 🎨 Dynamic spacing - appears when scrolling
  const heroCollapseProgress = useTransform(
    scrollY,
    [0, 120, 180],
    [0, 0.5, 1]
  );
  const timelinePaddingTop = useTransform(heroCollapseProgress, (value) => {
    const targetPadding = layoutSpacing.timelinePadding;
    return `${targetPadding * value}px`;
  });

  // 📏 Measure sticky header spacing
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
  useEffect(() => {
    if (selectedDay === 0) return;

    const firstActivity = document.querySelector(".activityCard");
    if (firstActivity) {
      setTimeout(() => {
        firstActivity.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [selectedDay]);

  // Redirect if no data
  if (!tripData || !itinerary) {
    return (
      <motion.div
        className={styles.notFound}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle size={48} />
        <h1>No trip data found</h1>
        <p>Please start by creating a trip plan</p>
        <button onClick={() => navigate("/explore")}>Plan a Trip</button>
      </motion.div>
    );
  }

  // Safe destructuring with fallbacks
  const summary = itinerary?.summary || { description: '', highlights: [] };
  const days = itinerary?.days || [];
  const tips = itinerary?.tips || {};
  const recommendations = itinerary?.recommendations || {};
  
  // Guard: if no days, show error
  if (days.length === 0) {
    return (
      <motion.div
        className={styles.notFound}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle size={48} />
        <h1>No itinerary generated</h1>
        <p>AI couldn't generate an itinerary. Please try again.</p>
        <button onClick={() => navigate("/explore")}>Try Again</button>
      </motion.div>
    );
  }
  
  const currentDay = days[selectedDay] || { activities: [], theme: '', day: selectedDay + 1 };

  // Get city name properly from trip data
  const cityName =
    tripData.location?.display_name?.split(",")[0] ||
    tripData.location?.name?.split(",")[0] ||
    "Your Destination";

  // Activity type icons
  const activityIcons = {
    sightseeing: <Camera size={20} />,
    food: <Utensils size={20} />,
    activity: <Star size={20} />,
    transport: <Car size={20} />,
    rest: <Heart size={20} />,
  };

  // Prepare trip data for TripHero with safe fallbacks
  const tripForHero = {
    id: cityId || 'unknown',
    name: cityName || 'Your Destination',
    country:
      tripData?.location?.address?.country ||
      tripData?.location?.display_name?.split(",").pop()?.trim() ||
      "",
    description: summary?.description || 'An unforgettable journey awaits you.',
    image: `https://source.unsplash.com/1600x900/?${encodeURIComponent(
      cityName || 'travel'
    )},travel`,
    highlights: summary?.highlights || [],
    days: days?.length || 0,
    activities: days?.reduce((sum, day) => sum + (day?.activities?.length || 0), 0) || 0,
  };

  return (
    <motion.div
      className={styles.tripView}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />

      {/* 🎨 Hero Section - Apple-like aesthetic */}
      <TripHero trip={tripForHero} mood={tripData.mood || "relax"} />

      {/* 📅 Day Selector - Sticky Tabs */}
      <motion.div
        className={styles.dayTabs}
        ref={dayTabsRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {days.map((day, index) => (
          <motion.button
            key={day?.day || index}
            className={`${styles.dayTab} ${
              selectedDay === index ? styles.active : ""
            }`}
            onClick={() => setSelectedDay(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.dayNumber}>Day {day?.day || index + 1}</span>
            <span className={styles.dayTheme}>{day?.theme || 'Explore'}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* 📍 Content - Timeline with Activities */}
      <div className={styles.content} ref={contentRef}>
        {/* Dynamic padding that appears when hero collapses */}
        <motion.div style={{ paddingTop: timelinePaddingTop }} />

        {/* Day Activities Timeline */}
        <motion.div
          className={styles.timeline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {(currentDay.activities || []).map((activity, index) => (
            <motion.div
              key={index}
              className={`${styles.activityCard} activityCard`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
              onClick={() =>
                setSelectedActivity(selectedActivity === index ? null : index)
              }
            >
              {/* Time Badge */}
              <div className={styles.activityTime}>
                <Clock size={16} />
                <span>{activity.time}</span>
              </div>

              {/* Activity Content */}
              <div className={styles.activityContent}>
                {/* Icon & Title */}
                <div className={styles.activityHeader}>
                  <div className={styles.activityIcon}>
                    {activityIcons[activity.type] || <Star size={20} />}
                  </div>
                  <div>
                    <h3 className={styles.activityTitle}>{activity.title}</h3>
                    <div className={styles.activityMeta}>
                      {activity.duration && (
                        <span className={styles.duration}>
                          <Clock size={14} />
                          {activity.duration}
                        </span>
                      )}
                      {activity.cost && (
                        <span className={styles.cost}>
                          <DollarSign size={14} />
                          {activity.cost}
                        </span>
                      )}
                      {activity.location && (
                        <span className={styles.location}>
                          <MapPin size={14} />
                          {activity.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {activity.description && (
                  <p className={styles.activityDescription}>
                    {activity.description}
                  </p>
                )}

                {/* Tips (expandable) */}
                {activity.tips && activity.tips.length > 0 && (
                  <div className={styles.activityTips}>
                    <Lightbulb size={16} />
                    <div>
                      <strong>Tips:</strong>
                      <ul>
                        {activity.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 💡 Tips Section - Expandable */}
        {tips && Object.keys(tips).length > 0 && (
          <motion.div
            className={styles.expandableSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              className={styles.expandButton}
              onClick={() => setShowTips(!showTips)}
            >
              <Lightbulb size={20} />
              <span>Travel Tips & Local Insights</span>
              {showTips ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showTips && (
              <motion.div
                className={styles.expandableContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.tipsGrid}>
                  {Object.entries(tips).map(([category, tipList]) => (
                    <div key={category} className={styles.tipCategory}>
                      <h4>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h4>
                      <ul>
                        {tipList.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 🍽️ Recommendations Section - Expandable */}
        {recommendations && (
          <motion.div
            className={styles.expandableSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              className={styles.expandButton}
              onClick={() => setShowRecommendations(!showRecommendations)}
            >
              <Compass size={20} />
              <span>Recommended Places & Experiences</span>
              {showRecommendations ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {showRecommendations && (
              <motion.div
                className={styles.expandableContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Restaurants */}
                {recommendations.restaurants &&
                  recommendations.restaurants.length > 0 && (
                    <div className={styles.recCategory}>
                      <h3>
                        <Utensils size={20} />
                        Restaurants & Dining
                      </h3>
                      <div className={styles.recGrid}>
                        {recommendations.restaurants.map(
                          (restaurant, index) => (
                            <motion.div
                              key={index}
                              className={styles.recCard}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -5 }}
                            >
                              <h4>{restaurant.name}</h4>
                              {restaurant.cuisine && (
                                <p className={styles.cuisine}>
                                  {restaurant.cuisine}
                                </p>
                              )}
                              {restaurant.priceRange && (
                                <p className={styles.priceRange}>
                                  {restaurant.priceRange}
                                </p>
                              )}
                              {restaurant.mustTry && (
                                <p className={styles.mustTry}>
                                  <strong>Must Try:</strong>{" "}
                                  {restaurant.mustTry}
                                </p>
                              )}
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Accommodations */}
                {recommendations.accommodations &&
                  recommendations.accommodations.length > 0 && (
                    <div className={styles.recCategory}>
                      <h3>
                        <Hotel size={20} />
                        Where to Stay
                      </h3>
                      <div className={styles.recGrid}>
                        {recommendations.accommodations.map((place, index) => (
                          <motion.div
                            key={index}
                            className={styles.recCard}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                          >
                            <h4>{place.name}</h4>
                            {place.type && (
                              <p className={styles.type}>{place.type}</p>
                            )}
                            {place.area && (
                              <p className={styles.area}>
                                <MapPin size={14} />
                                {place.area}
                              </p>
                            )}
                            {place.priceRange && (
                              <p className={styles.priceRange}>
                                {place.priceRange}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Local Experiences */}
                {recommendations.localExperiences &&
                  recommendations.localExperiences.length > 0 && (
                    <div className={styles.recCategory}>
                      <h3>
                        <Star size={20} />
                        Local Experiences
                      </h3>
                      <div className={styles.recGrid}>
                        {recommendations.localExperiences.map(
                          (experience, index) => (
                            <motion.div
                              key={index}
                              className={styles.recCard}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -5 }}
                            >
                              <h4>{experience.name}</h4>
                              <p className={styles.description}>
                                {experience.description}
                              </p>
                              {experience.duration && (
                                <p className={styles.duration}>
                                  <Clock size={14} />
                                  {experience.duration}
                                </p>
                              )}
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TripViewAI;
