/**
 * 🔍 LOCATION SEARCH DROPDOWN
 *
 * Autocomplete dropdown component for location search
 * Apple-inspired design with smooth animations
 */

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import styles from "./LocationSearchDropdown.module.css";

const LocationSearchDropdown = ({
  results = [],
  isLoading = false,
  isEmpty = false,
  error = null,
  onSelect,
  isVisible = false,
}) => {
  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.dropdown}
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Loading State */}
        {isLoading && results.length === 0 && (
          <div className={styles.statusMessage}>
            <Loader2 size={20} className={styles.spinner} />
            <span>Searching locations...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`${styles.statusMessage} ${styles.error}`}>
            <AlertCircle size={20} />
            <span>Failed to load locations. Try again.</span>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className={styles.resultsList}>
            {results.map((location, index) => (
              <LocationResult
                key={location.id}
                location={location}
                index={index}
                onClick={() => onSelect(location)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && results.length === 0 && (
          <div className={styles.statusMessage}>
            <MapPin size={20} opacity={0.5} />
            <span>No locations found. Try a different search.</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Individual location result item
 */
const LocationResult = ({ location, index, onClick }) => {
  return (
    <motion.div
      className={styles.resultItem}
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.03,
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        backgroundColor: "rgba(0, 122, 255, 0.04)",
        x: 3,
        transition: { duration: 0.15 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.resultIcon}>
        <MapPin size={18} />
      </div>

      <div className={styles.resultContent}>
        <div className={styles.resultName}>{location.city}</div>
        <div className={styles.resultCountry}>
          {location.country}
          {location.state && ` • ${location.state}`}
        </div>
      </div>

      {/* Population badge (if available) */}
      {location.population > 0 && (
        <div className={styles.populationBadge}>
          {formatPopulation(location.population)}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Format population numbers
 * 1234567 → "1.2M"
 */
function formatPopulation(population) {
  if (population >= 1_000_000) {
    return `${(population / 1_000_000).toFixed(1)}M`;
  }
  if (population >= 1_000) {
    return `${Math.round(population / 1_000)}K`;
  }
  return population.toString();
}

export default LocationSearchDropdown;
