import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Waves, Palette, Mountain, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocationSearch } from "../hooks/useLocationSearch";
import { LocationSearchDropdown } from "../components";
import { getLocationThumbnail } from "../services/geocoding";
import { useLoader } from "../hooks/useLoaderStore.jsx";
import { generateTripItinerary, validateApiKey } from "../services/aiService";
import styles from "./TripSelector.module.css";

// 👥 Travel Group Types (Simplified)
const travelGroups = [
  {
    id: "solo",
    name: "Solo Traveler",
    emoji: "🧳",
    description: "Freedom & self-discovery",
  },
  {
    id: "couple",
    name: "Couple",
    emoji: "💑",
    description: "Romantic experiences",
  },
  {
    id: "family",
    name: "Family",
    emoji: "👨‍👩‍👧‍👦",
    description: "Kid-friendly activities",
  },
  {
    id: "friends",
    name: "Friends",
    emoji: "👯",
    description: "Fun & social vibes",
  },
];

// 💰 Budget Ranges
const budgetRanges = [
  {
    id: "budget",
    name: "Budget",
    emoji: "🪙",
    range: "< $50/day",
    description: "Local spots, street food",
  },
  {
    id: "moderate",
    name: "Moderate",
    emoji: "💵",
    range: "$50-150/day",
    description: "Balanced comfort & value",
  },
  {
    id: "luxury",
    name: "Luxury",
    emoji: "💎",
    range: "$150+/day",
    description: "Premium experiences",
  },
];

// ⏱️ Trip Duration
const durations = [
  { id: "1day", name: "1 Day", emoji: "☀️", hours: 24 },
  { id: "weekend", name: "Weekend", emoji: "📅", hours: 48 },
  { id: "week", name: "Week", emoji: "🗓️", hours: 168 },
  { id: "custom", name: "Custom", emoji: "⚙️", hours: null },
];

// 🎯 Interests & Activities
const interests = [
  { id: "food", name: "Food & Dining", emoji: "🍽️" },
  { id: "art", name: "Art & Museums", emoji: "🎨" },
  { id: "nature", name: "Nature & Parks", emoji: "🌳" },
  { id: "nightlife", name: "Nightlife", emoji: "🌃" },
  { id: "shopping", name: "Shopping", emoji: "🛍️" },
  { id: "history", name: "History", emoji: "🏛️" },
  { id: "photography", name: "Photography", emoji: "📸" },
  { id: "wellness", name: "Wellness & Spa", emoji: "🧘" },
];

// ♿ Accessibility Needs
const accessibilityOptions = [
  { id: "wheelchair", name: "Wheelchair Access", emoji: "♿" },
  { id: "limited_mobility", name: "Limited Mobility", emoji: "🚶" },
  { id: "visual_impairment", name: "Visual Impairment", emoji: "👁️" },
  { id: "hearing_impairment", name: "Hearing Impairment", emoji: "👂" },
];

// 👤 Traveler Details (Optional)
const ageGroups = [
  { id: "child", name: "Children (0-12)", emoji: "👶", range: "0-12" },
  { id: "teen", name: "Teenagers (13-17)", emoji: "🧒", range: "13-17" },
  { id: "adult", name: "Adults (18-64)", emoji: "🧑", range: "18-64" },
  { id: "senior", name: "Seniors (65+)", emoji: "👴", range: "65+" },
];

// 🌤️ Season Preferences (affects clothing, activities)
const seasonPreferences = [
  {
    id: "summer",
    name: "Summer Vibes",
    emoji: "☀️",
    description: "Beach, outdoor cafes",
  },
  {
    id: "winter",
    name: "Winter Cozy",
    emoji: "❄️",
    description: "Museums, indoor activities",
  },
  {
    id: "spring",
    name: "Spring Fresh",
    emoji: "🌸",
    description: "Gardens, festivals",
  },
  {
    id: "autumn",
    name: "Autumn Colors",
    emoji: "🍂",
    description: "Parks, warm drinks",
  },
];

// 🎭 Experience Level
const experienceLevels = [
  {
    id: "first_timer",
    name: "First Timer",
    emoji: "🗺️",
    description: "Popular highlights",
  },
  {
    id: "explorer",
    name: "Explorer",
    emoji: "🧭",
    description: "Mix of known & hidden",
  },
  {
    id: "local_expert",
    name: "Local Expert",
    emoji: "🏆",
    description: "Off the beaten path",
  },
];

// 🍽️ Dietary Preferences (Quick select + multi-select option)
const dietaryQuickOptions = [
  {
    id: "no_restrictions",
    name: "No Restrictions",
    emoji: "🍴",
    description: "Eat everything",
  },
  { id: "vegetarian", name: "Vegetarian", emoji: "🥗", description: "No meat" },
  { id: "vegan", name: "Vegan", emoji: "🌱", description: "Plant-based only" },
  {
    id: "custom",
    name: "Custom",
    emoji: "⚙️",
    description: "Multiple restrictions",
  },
];

const dietaryDetailedOptions = [
  { id: "halal", name: "Halal", emoji: "🕌" },
  { id: "kosher", name: "Kosher", emoji: "✡️" },
  { id: "gluten_free", name: "Gluten-Free", emoji: "🌾" },
  { id: "lactose_free", name: "Lactose-Free", emoji: "🥛" },
  { id: "nut_allergy", name: "Nut Allergy", emoji: "🥜" },
];

// ⚡ Activity Pace
const activityPaces = [
  {
    id: "slow",
    name: "Slow & Relaxed",
    emoji: "🐢",
    description: "2-3 places/day",
  },
  {
    id: "moderate",
    name: "Moderate",
    emoji: "🚶",
    description: "4-6 places/day",
  },
  { id: "fast", name: "Fast-Paced", emoji: "🏃", description: "7+ places/day" },
];

// 🏨 Accommodation Style (for future hotel recommendations)
const accommodationStyles = [
  {
    id: "hostel",
    name: "Hostel/Budget",
    emoji: "🏠",
    description: "Social, affordable",
  },
  {
    id: "hotel",
    name: "Hotel",
    emoji: "🏨",
    description: "Comfortable, standard",
  },
  {
    id: "boutique",
    name: "Boutique",
    emoji: "✨",
    description: "Unique, charming",
  },
  {
    id: "luxury",
    name: "Luxury Resort",
    emoji: "🏰",
    description: "Premium, upscale",
  },
];

// 🚗 Transportation Preference
const transportPreferences = [
  {
    id: "walking",
    name: "Walking",
    emoji: "🚶",
    description: "Explore on foot",
  },
  {
    id: "public",
    name: "Public Transport",
    emoji: "🚇",
    description: "Trains, buses, metro",
  },
  {
    id: "bike",
    name: "Cycling",
    emoji: "🚴",
    description: "Bike-friendly routes",
  },
  {
    id: "car",
    name: "Car/Taxi",
    emoji: "🚗",
    description: "Private transport",
  },
];

// 📱 Tech Preferences
const techPreferences = [
  {
    id: "offline",
    name: "Offline Ready",
    emoji: "📴",
    description: "Downloaded maps & guides",
  },
  {
    id: "connected",
    name: "Always Connected",
    emoji: "📱",
    description: "Real-time updates",
  },
  {
    id: "minimal",
    name: "Minimal Tech",
    emoji: "🗺️",
    description: "Traditional navigation",
  },
];

// 🌈 Travel Moods
const moods = [
  {
    id: "relax",
    name: "Relax",
    icon: Waves,
    description: "Slow pace, nature, mindfulness",
    color: "#93C5FD",
  },
  {
    id: "culture",
    name: "Culture",
    icon: Palette,
    description: "Museums, local life, authentic experiences",
    color: "#C4B5FD",
  },
  {
    id: "adventure",
    name: "Adventure",
    icon: Mountain,
    description: "Active, exploration, memorable moments",
    color: "#FCA5A5",
  },
];

const destinations = [
  {
    id: "lisbon",
    name: "Lisbon, Portugal",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600",
  },
  {
    id: "krakow",
    name: "Kraków, Poland",
    image:
      "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQkKYunfGgFDtF8X8UYJxdCOZgRiMbFHTp3uBhfin-xFMsKfiYQP-JEZZ6etdur3P7dEGhNJWnvzbCGwdkduyO6em3mzXA4sdabw1XfgZw",
  },
];

const TripSelector = () => {
  const navigate = useNavigate();

  // Step 1: Destination
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Step 2: Travel Group
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupSection, setShowGroupSection] = useState(false);

  // Step 3: Duration
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [customDays, setCustomDays] = useState("");
  const [showDurationSection, setShowDurationSection] = useState(false);

  // Step 4: Budget
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showBudgetSection, setShowBudgetSection] = useState(false);

  // Step 5: Interests (multi-select)
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterestsSection, setShowInterestsSection] = useState(false);

  // Step 6: Mood
  const [selectedMood, setSelectedMood] = useState(null);
  const [showMoodSection, setShowMoodSection] = useState(false);

  // Optional Advanced Settings
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedAccessibility, setSelectedAccessibility] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState("no_restrictions"); // Quick select
  const [selectedDietaryDetails, setSelectedDietaryDetails] = useState([]); // Multi-select for custom
  const [showDietaryDetails, setShowDietaryDetails] = useState(false);
  const [selectedPace, setSelectedPace] = useState("moderate"); // Default: moderate pace
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState([
    "walking",
    "public",
    "car",
  ]); // Default: all except bike
  const [selectedTech, setSelectedTech] = useState(null);

  // Advanced sections visibility (progressive disclosure)
  const [showSeasonSection, setShowSeasonSection] = useState(false);
  const [showExperienceSection, setShowExperienceSection] = useState(false);
  const [showDietarySection, setShowDietarySection] = useState(false);
  const [showPaceSection, setShowPaceSection] = useState(false);
  const [showAccommodationSection, setShowAccommodationSection] =
    useState(false);
  const [showTransportSection, setShowTransportSection] = useState(false);
  const [showTechSection, setShowTechSection] = useState(false);

  // Refs for smooth scrolling
  const groupSectionRef = useRef(null);
  const durationSectionRef = useRef(null);
  const budgetSectionRef = useRef(null);
  const interestsSectionRef = useRef(null);
  const moodSectionRef = useRef(null);
  const advancedSettingsRef = useRef(null);
  const seasonSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);
  const dietarySectionRef = useRef(null);
  const paceSectionRef = useRef(null);
  const accommodationSectionRef = useRef(null);
  const transportSectionRef = useRef(null);
  const techSectionRef = useRef(null);
  const actionButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  // 🔍 Advanced location search with debouncing
  const {
    query,
    setQuery,
    results,
    isLoading,
    isEmpty,
    error,
    hasResults,
    clearSearch,
  } = useLocationSearch({
    debounceDelay: 300,
    minQueryLength: 2,
    maxResults: 10,
  });

  // 🎬 Progressive disclosure: destination → group → duration → budget → interests → mood
  const handleDestinationSelect = (destId) => {
    setSelectedDestination(destId);
    setTimeout(() => setShowGroupSection(true), 200);
  };

  // 🌍 Handle location selection from search results
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSelectedDestination(location.id);
    setQuery("");
    setIsSearchFocused(false);

    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }

    setTimeout(() => setShowGroupSection(true), 200);
  };

  // 👥 Handle group selection
  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    setTimeout(() => setShowDurationSection(true), 200);
  };

  // ⏱️ Handle duration selection
  const handleDurationSelect = (durationId) => {
    setSelectedDuration(durationId);
    setTimeout(() => setShowBudgetSection(true), 200);
  };

  // 💰 Handle budget selection
  const handleBudgetSelect = (budgetId) => {
    setSelectedBudget(budgetId);
    if (!showInterestsSection) {
      setTimeout(() => setShowInterestsSection(true), 200);
    }
  };

  // 🎯 Handle interest toggle (multi-select)
  const handleInterestToggle = (interestId) => {
    setSelectedInterests((prev) => {
      const newSelection = prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId];

      return newSelection;
    });
  };

  // 🔧 Toggle multi-select options (accessibility, age, dietary, transport)
  const toggleMultiSelect = (setter) => (id) => {
    setter((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAccessibilityToggle = toggleMultiSelect(setSelectedAccessibility);
  const handleAgeGroupToggle = toggleMultiSelect(setSelectedAgeGroups);
  const handleDietaryDetailToggle = toggleMultiSelect(
    setSelectedDietaryDetails
  );
  const handleTransportToggle = toggleMultiSelect(setSelectedTransport);

  // Handle dietary quick select
  const handleDietarySelect = (dietaryId) => {
    setSelectedDietary(dietaryId);
    setShowDietaryDetails(dietaryId === "custom");
    if (!showPaceSection) {
      setTimeout(() => setShowPaceSection(true), 200);
    }
  };

  // Handle single-select advanced options with auto-reveal
  const handleSeasonSelect = (seasonId) => {
    setSelectedSeason(seasonId);
    if (!showExperienceSection) {
      setTimeout(() => setShowExperienceSection(true), 200);
    }
  };

  const handleExperienceSelect = (experienceId) => {
    setSelectedExperience(experienceId);
    if (!showDietarySection) {
      setTimeout(() => setShowDietarySection(true), 200);
    }
  };

  const handlePaceSelect = (paceId) => {
    setSelectedPace(paceId);
    if (!showAccommodationSection) {
      setTimeout(() => setShowAccommodationSection(true), 200);
    }
  };

  const handleAccommodationSelect = (accommodationId) => {
    setSelectedAccommodation(accommodationId);
    if (!showTransportSection) {
      setTimeout(() => setShowTransportSection(true), 200);
    }
  };

  // Handle transport continue button (multi-select)
  const handleTransportContinue = () => {
    if (!showTechSection) {
      setShowTechSection(true);
    }
  };

  const handleTechSelect = (techId) => {
    setSelectedTech(techId);
    // Last section - optionally scroll to action button
  };

  // 🧹 Clear selected location
  const handleClearLocation = () => {
    setSelectedLocation(null);
    setSelectedDestination(null);
    setSelectedGroup(null);
    setSelectedDuration(null);
    setSelectedBudget(null);
    setSelectedInterests([]);
    setSelectedMood(null);
    setShowGroupSection(false);
    setShowDurationSection(false);
    setShowBudgetSection(false);
    setShowInterestsSection(false);
    setShowMoodSection(false);
    setShowAdvancedSettings(false);
    // Clear advanced settings
    setSelectedAccessibility([]);
    setSelectedAgeGroups([]);
    setSelectedSeason(null);
    setSelectedExperience(null);
    setSelectedDietary("no_restrictions");
    setSelectedDietaryDetails([]);
    setShowDietaryDetails(false);
    setSelectedPace("moderate");
    setSelectedAccommodation(null);
    setSelectedTransport(["walking", "public", "car"]);
    setSelectedTech(null);
    clearSearch();
  };

  // 📜 Smart auto-scroll - only if section is not visible (Apple-like progressive disclosure)
  const scrollToSection = (ref) => {
    if (!ref.current) return;

    setTimeout(() => {
      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if element is already visible
      const isVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

      // Only scroll if not visible or partially visible
      if (!isVisible || rect.top < 100 || rect.bottom > viewportHeight - 100) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 100); // Slight delay for animation to start
  };

  useEffect(() => {
    if (showGroupSection && groupSectionRef.current)
      scrollToSection(groupSectionRef);
  }, [showGroupSection]);

  useEffect(() => {
    if (showDurationSection && durationSectionRef.current)
      scrollToSection(durationSectionRef);
  }, [showDurationSection]);

  useEffect(() => {
    if (showBudgetSection && budgetSectionRef.current)
      scrollToSection(budgetSectionRef);
  }, [showBudgetSection]);

  useEffect(() => {
    if (showInterestsSection && interestsSectionRef.current)
      scrollToSection(interestsSectionRef);
  }, [showInterestsSection]);

  useEffect(() => {
    if (showMoodSection && moodSectionRef.current)
      scrollToSection(moodSectionRef);
  }, [showMoodSection]);

  useEffect(() => {
    if (showAdvancedSettings && advancedSettingsRef.current) {
      scrollToSection(advancedSettingsRef);
      // Show first advanced section (accessibility + age groups always visible)
      // Then reveal season section
      setTimeout(() => setShowSeasonSection(true), 400);
    }
  }, [showAdvancedSettings]);

  // Auto-scroll for advanced sections
  useEffect(() => {
    if (showSeasonSection && seasonSectionRef.current)
      scrollToSection(seasonSectionRef);
  }, [showSeasonSection]);

  useEffect(() => {
    if (showExperienceSection && experienceSectionRef.current)
      scrollToSection(experienceSectionRef);
  }, [showExperienceSection]);

  useEffect(() => {
    if (showDietarySection && dietarySectionRef.current)
      scrollToSection(dietarySectionRef);
  }, [showDietarySection]);

  useEffect(() => {
    if (showPaceSection && paceSectionRef.current)
      scrollToSection(paceSectionRef);
  }, [showPaceSection]);

  useEffect(() => {
    if (showAccommodationSection && accommodationSectionRef.current)
      scrollToSection(accommodationSectionRef);
  }, [showAccommodationSection]);

  useEffect(() => {
    if (showTransportSection && transportSectionRef.current)
      scrollToSection(transportSectionRef);
  }, [showTransportSection]);

  useEffect(() => {
    if (showTechSection && techSectionRef.current)
      scrollToSection(techSectionRef);
  }, [showTechSection]);

  // 🎯 Auto-scroll to action button when mood is selected
  // Apple-like: gentle guidance, brings CTA into view with comfortable margin
  useEffect(() => {
    if (selectedMood && actionButtonRef.current && showMoodSection) {
      // Delay to let mood selection animation complete
      setTimeout(() => {
        const button = actionButtonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const bottomMargin = 100; // 100px breathing space from bottom

        // Check if button is already comfortably visible
        const isVisible =
          rect.top >= 0 && rect.bottom <= viewportHeight - bottomMargin;

        // Only scroll if button is not visible or too close to edge
        if (!isVisible) {
          // Scroll so button appears with comfortable bottom margin
          const scrollTarget =
            window.scrollY + rect.bottom - viewportHeight + bottomMargin;

          window.scrollTo({
            top: scrollTarget,
            behavior: "smooth",
          });
        }
      }, 400); // Synced with mood card scale animation (250ms) + buffer
    }
  }, [selectedMood, showMoodSection]);

  // Initialize loader hook
  const { showLoader, hideLoader, updateMessage } = useLoader();

  const handlePlanTrip = async () => {
    if (!selectedDestination) return;

    try {
      // Check if API key is configured
      if (!validateApiKey()) {
        alert(
          "⚠️ Google AI API key not configured!\n\nPlease add your API key to the .env file:\nVITE_GOOGLE_AI_API_KEY=your_key_here\n\nGet your key from: https://makersuite.google.com/app/apikey"
        );
        return;
      }

      // Prepare trip data
      const tripData = {
        destination: selectedDestination,
        location: selectedLocation,
        group: selectedGroup,
        duration: selectedDuration,
        customDays: customDays,
        budget: selectedBudget,
        interests: selectedInterests,
        mood: selectedMood || "relax",
        accessibility: selectedAccessibility,
        ageGroups: selectedAgeGroups,
        season: selectedSeason,
        experience: selectedExperience,
        dietary:
          selectedDietary === "custom"
            ? selectedDietaryDetails
            : [selectedDietary],
        pace: selectedPace,
        accommodation: selectedAccommodation,
        transport: selectedTransport,
        tech: selectedTech,
      };

      // Show loader with planning message
      showLoader("Creating your perfect journey...", "planning");

      // Step 1: Analyzing preferences
      updateMessage("🧠 Analyzing your preferences...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 2: Generate itinerary with AI
      updateMessage("✨ AI is creating your personalized itinerary...");
      const itinerary = await generateTripItinerary(tripData);

      // Step 3: Optimizing routes
      updateMessage("🗺️ Optimizing routes and timing...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 4: Finalizing
      updateMessage("🎉 Finalizing your perfect trip...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      hideLoader();

      // Navigate to trip view with generated itinerary
      navigate(`/trip/${selectedDestination}`, {
        state: {
          tripData,
          itinerary,
        },
      });
    } catch (error) {
      hideLoader();
      console.error("Trip planning error:", error);
      alert(
        `❌ Failed to generate your trip:\n\n${error.message}\n\nPlease try again or check your API key configuration.`
      );
    }
  };

  // Check if all required steps are completed
  const isConfigComplete =
    selectedDestination && selectedGroup && selectedDuration && selectedBudget;

  // Calculate progress (4 required steps)
  const completedRequiredSteps = [
    selectedDestination,
    selectedGroup,
    selectedDuration,
    selectedBudget,
  ].filter(Boolean).length;

  // Calculate optional steps (2 optional steps)
  const completedOptionalSteps = [
    selectedInterests.length > 0,
    selectedMood,
  ].filter(Boolean).length;

  const totalRequiredSteps = 4;
  const totalOptionalSteps = 2;
  const allRequiredComplete = completedRequiredSteps === totalRequiredSteps;
  const progressPercentage =
    (completedRequiredSteps / totalRequiredSteps) * 100;

  return (
    <motion.div
      className={styles.selector}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className={styles.title}>Where does your journey begin?</h1>
          <p className={styles.subtitle}>
            Choose a destination and let AI craft your perfect calm journey
          </p>
        </motion.div>

        {/* Destination Search */}
        <motion.div
          className={styles.searchSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Search Input with Dropdown */}
          <div className={styles.searchContainer}>
            <div
              className={`${styles.searchBox} ${
                isSearchFocused ? styles.focused : ""
              } ${selectedLocation ? styles.hasSelection : ""}`}
            >
              <Search size={20} className={styles.searchIcon} />

              {/* Show selected location or input */}
              {selectedLocation ? (
                <div className={styles.selectedLocationDisplay}>
                  <span className={styles.selectedLocationName}>
                    {selectedLocation.name}
                  </span>
                  <button
                    className={styles.clearButton}
                    onClick={handleClearLocation}
                    aria-label="Clear selection"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search any city worldwide..."
                  className={styles.searchInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    // Delay to allow click on dropdown items
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                />
              )}
            </div>

            {/* Search Results Dropdown */}
            <LocationSearchDropdown
              results={results}
              isLoading={isLoading}
              isEmpty={isEmpty}
              error={error}
              onSelect={handleLocationSelect}
              isVisible={
                isSearchFocused && (hasResults || isLoading || isEmpty || error)
              }
            />
          </div>

          <div className={styles.destinationGrid}>
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                className={`${styles.destinationCard} ${
                  selectedDestination === dest.id ? styles.selected : ""
                }`}
                onClick={() => handleDestinationSelect(dest.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.destinationImage}>
                  <img src={dest.image} alt={dest.name} />
                  <div className={styles.destinationOverlay}>
                    <span className={styles.destinationName}>{dest.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Travel Group Selector - Step 2 */}
        {showGroupSection && (
          <motion.div
            ref={groupSectionRef}
            className={styles.configSection}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Who's traveling?
            </motion.h2>

            <div className={styles.compactGrid}>
              {travelGroups.map((group, index) => (
                <motion.button
                  key={group.id}
                  className={`${styles.compactCard} ${
                    selectedGroup === group.id ? styles.selectedCompact : ""
                  }`}
                  onClick={() => handleGroupSelect(group.id)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.compactEmoji}>{group.emoji}</span>
                  <h3 className={styles.compactName}>{group.name}</h3>
                  <p className={styles.compactDesc}>{group.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Duration Selector - Step 3 */}
        {showDurationSection && (
          <motion.div
            ref={durationSectionRef}
            className={styles.configSection}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              How long is your trip?
            </motion.h2>

            <div className={styles.compactGrid}>
              {durations.map((duration, index) => (
                <motion.button
                  key={duration.id}
                  className={`${styles.compactCard} ${
                    selectedDuration === duration.id
                      ? styles.selectedCompact
                      : ""
                  }`}
                  onClick={() => handleDurationSelect(duration.id)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.compactEmoji}>{duration.emoji}</span>
                  <h3 className={styles.compactName}>{duration.name}</h3>
                </motion.button>
              ))}
            </div>

            {selectedDuration === "custom" && (
              <motion.div
                className={styles.customInput}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="number"
                  min="1"
                  max="30"
                  placeholder="Enter number of days..."
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className={styles.daysInput}
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Budget Selector - Step 4 */}
        {showBudgetSection && (
          <motion.div
            ref={budgetSectionRef}
            className={styles.configSection}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              What's your budget?
            </motion.h2>

            <div className={styles.budgetGrid}>
              {budgetRanges.map((budget, index) => (
                <motion.button
                  key={budget.id}
                  className={`${styles.budgetCard} ${
                    selectedBudget === budget.id ? styles.selectedBudget : ""
                  }`}
                  onClick={() => handleBudgetSelect(budget.id)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.budgetEmoji}>{budget.emoji}</span>
                  <h3 className={styles.budgetName}>{budget.name}</h3>
                  <p className={styles.budgetRange}>{budget.range}</p>
                  <p className={styles.budgetDesc}>{budget.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interests Selector - Step 5 (Multi-select) */}
        {showInterestsSection && (
          <motion.div
            ref={interestsSectionRef}
            className={styles.configSection}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              What interests you?{" "}
              <span className={styles.optional}>(Select all that apply)</span>
            </motion.h2>

            <div className={styles.interestsGrid}>
              {interests.map((interest, index) => (
                <motion.button
                  key={interest.id}
                  className={`${styles.interestChip} ${
                    selectedInterests.includes(interest.id)
                      ? styles.selectedChip
                      : ""
                  }`}
                  onClick={() => handleInterestToggle(interest.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.03, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.chipEmoji}>{interest.emoji}</span>
                  <span className={styles.chipName}>{interest.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Continue Button for multi-select */}
            {selectedInterests.length > 0 && (
              <motion.div
                className={styles.continueButtonWrapper}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <motion.button
                  className={styles.continueButton}
                  onClick={() => !showMoodSection && setShowMoodSection(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Mood Selector - Step 6 (Optional) */}
        {showMoodSection && (
          <motion.div
            ref={moodSectionRef}
            className={styles.moodSection}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.3 },
            }}
          >
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              What's your travel mood?{" "}
              <span className={styles.optional}>(Optional)</span>
            </motion.h2>

            <div className={styles.moodGrid}>
              {moods.map((mood, index) => {
                const Icon = mood.icon;
                return (
                  <motion.button
                    key={mood.id}
                    className={`${styles.moodCard} ${
                      selectedMood === mood.id ? styles.selectedMood : ""
                    }`}
                    onClick={() => setSelectedMood(mood.id)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: selectedMood === mood.id ? [1, 1.08, 1] : 1,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.06,
                      duration: 0.3,
                      scale: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                    }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      "--mood-color": mood.color,
                    }}
                  >
                    <div className={styles.moodIcon}>
                      <Icon size={32} />
                    </div>
                    <h3 className={styles.moodName}>{mood.name}</h3>
                    <p className={styles.moodDescription}>{mood.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Advanced Settings Toggle */}
        {showMoodSection && (
          <motion.div
            className={styles.advancedToggleSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              className={styles.advancedToggleButton}
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.advancedToggleText}>
                {showAdvancedSettings ? "Hide" : "Show"} Advanced Options
              </span>
              <span className={styles.advancedToggleIcon}>
                {showAdvancedSettings ? "▼" : "▶"}
              </span>
            </motion.button>
            <p className={styles.advancedToggleHint}>
              Customize accessibility, dietary needs, pace & more
            </p>
          </motion.div>
        )}

        {/* Advanced Settings - Collapsible */}
        {showAdvancedSettings && (
          <motion.div
            ref={advancedSettingsRef}
            className={styles.advancedSettings}
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Accessibility Needs */}
            <motion.div
              className={styles.advancedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3 className={styles.advancedTitle}>
                ♿ Accessibility Needs{" "}
                <span className={styles.optional}>(Select if applicable)</span>
              </h3>
              <div className={styles.chipsContainer}>
                {accessibilityOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    className={`${styles.advancedChip} ${
                      selectedAccessibility.includes(option.id)
                        ? styles.selectedChip
                        : ""
                    }`}
                    onClick={() => handleAccessibilityToggle(option.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index, duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.chipEmoji}>{option.emoji}</span>
                    <span className={styles.chipName}>{option.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Age Groups */}
            <motion.div
              className={styles.advancedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <h3 className={styles.advancedTitle}>
                👤 Age Groups in Your Party{" "}
                <span className={styles.optional}>(Optional)</span>
              </h3>
              <div className={styles.chipsContainer}>
                {ageGroups.map((age, index) => (
                  <motion.button
                    key={age.id}
                    className={`${styles.advancedChip} ${
                      selectedAgeGroups.includes(age.id)
                        ? styles.selectedChip
                        : ""
                    }`}
                    onClick={() => handleAgeGroupToggle(age.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index, duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.chipEmoji}>{age.emoji}</span>
                    <span className={styles.chipName}>{age.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Season Preference */}
            {showSeasonSection && (
              <motion.div
                ref={seasonSectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  🌤️ Season Vibe{" "}
                  <span className={styles.optional}>(Optional)</span>
                </h3>
                <div className={styles.compactGrid}>
                  {seasonPreferences.map((season, index) => (
                    <motion.button
                      key={season.id}
                      className={`${styles.compactCard} ${
                        selectedSeason === season.id
                          ? styles.selectedCompact
                          : ""
                      }`}
                      onClick={() => handleSeasonSelect(season.id)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.compactEmoji}>
                        {season.emoji}
                      </span>
                      <h4 className={styles.compactName}>{season.name}</h4>
                      <p className={styles.compactDesc}>{season.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Experience Level */}
            {showExperienceSection && (
              <motion.div
                ref={experienceSectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  🎭 Experience Level{" "}
                  <span className={styles.optional}>(Optional)</span>
                </h3>
                <div className={styles.compactGrid}>
                  {experienceLevels.map((level, index) => (
                    <motion.button
                      key={level.id}
                      className={`${styles.compactCard} ${
                        selectedExperience === level.id
                          ? styles.selectedCompact
                          : ""
                      }`}
                      onClick={() => handleExperienceSelect(level.id)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.compactEmoji}>{level.emoji}</span>
                      <h4 className={styles.compactName}>{level.name}</h4>
                      <p className={styles.compactDesc}>{level.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Dietary Preferences */}
            {showDietarySection && (
              <motion.div
                ref={dietarySectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  🍽️ Dietary Preferences{" "}
                  <span className={styles.optional}>(Optional)</span>
                </h3>
                <div className={styles.compactGrid}>
                  {dietaryQuickOptions.map((diet, index) => (
                    <motion.button
                      key={diet.id}
                      className={`${styles.compactCard} ${
                        selectedDietary === diet.id
                          ? styles.selectedCompact
                          : ""
                      }`}
                      onClick={() => handleDietarySelect(diet.id)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.compactEmoji}>{diet.emoji}</span>
                      <h4 className={styles.compactName}>{diet.name}</h4>
                      <p className={styles.compactDesc}>{diet.description}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Detailed dietary options - shown when "Custom" selected */}
                {showDietaryDetails && (
                  <motion.div
                    className={styles.dietaryDetailsContainer}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className={styles.dietaryDetailsLabel}>
                      Select specific restrictions:
                    </p>
                    <div className={styles.chipsContainer}>
                      {dietaryDetailedOptions.map((detail, index) => (
                        <motion.button
                          key={detail.id}
                          className={`${styles.advancedChip} ${
                            selectedDietaryDetails.includes(detail.id)
                              ? styles.selectedChip
                              : ""
                          }`}
                          onClick={() => handleDietaryDetailToggle(detail.id)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * index, duration: 0.2 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className={styles.chipEmoji}>
                            {detail.emoji}
                          </span>
                          <span className={styles.chipName}>{detail.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Activity Pace */}
            {showPaceSection && (
              <motion.div
                ref={paceSectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  ⚡ Activity Pace{" "}
                  <span className={styles.optional}>(Optional)</span>
                </h3>
                <div className={styles.compactGrid}>
                  {activityPaces.map((pace, index) => (
                    <motion.button
                      key={pace.id}
                      className={`${styles.compactCard} ${
                        selectedPace === pace.id ? styles.selectedCompact : ""
                      }`}
                      onClick={() => handlePaceSelect(pace.id)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.compactEmoji}>{pace.emoji}</span>
                      <h4 className={styles.compactName}>{pace.name}</h4>
                      <p className={styles.compactDesc}>{pace.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Accommodation Style */}
            {showAccommodationSection && (
              <motion.div
                ref={accommodationSectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  🏨 Accommodation Style{" "}
                  <span className={styles.optional}>(Optional)</span>
                </h3>
                <div className={styles.compactGrid}>
                  {accommodationStyles.map((acc, index) => (
                    <motion.button
                      key={acc.id}
                      className={`${styles.compactCard} ${
                        selectedAccommodation === acc.id
                          ? styles.selectedCompact
                          : ""
                      }`}
                      onClick={() => handleAccommodationSelect(acc.id)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.compactEmoji}>{acc.emoji}</span>
                      <h4 className={styles.compactName}>{acc.name}</h4>
                      <p className={styles.compactDesc}>{acc.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Transportation Preference */}
            {showTransportSection && (
              <motion.div
                ref={transportSectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  🚗 Transportation{" "}
                  <span className={styles.optional}>
                    (Select all that apply)
                  </span>
                </h3>
                <div className={styles.chipsContainer}>
                  {transportPreferences.map((transport, index) => (
                    <motion.button
                      key={transport.id}
                      className={`${styles.advancedChip} ${
                        selectedTransport.includes(transport.id)
                          ? styles.selectedChip
                          : ""
                      }`}
                      onClick={() => handleTransportToggle(transport.id)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index, duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.chipEmoji}>
                        {transport.emoji}
                      </span>
                      <span className={styles.chipName}>{transport.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Continue Button for transport multi-select */}
                <motion.div
                  className={styles.continueButtonWrapper}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <motion.button
                    className={styles.continueButton}
                    onClick={handleTransportContinue}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Continue →
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* Tech Preferences */}
            {showTechSection && (
              <motion.div
                ref={techSectionRef}
                className={styles.advancedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <h3 className={styles.advancedTitle}>
                  📱 Tech Preferences{" "}
                  <span className={styles.optional}>(Optional)</span>
                </h3>
                <div className={styles.compactGrid}>
                  {techPreferences.map((tech, index) => (
                    <motion.button
                      key={tech.id}
                      className={`${styles.compactCard} ${
                        selectedTech === tech.id ? styles.selectedCompact : ""
                      }`}
                      onClick={() => handleTechSelect(tech.id)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.compactEmoji}>{tech.emoji}</span>
                      <h4 className={styles.compactName}>{tech.name}</h4>
                      <p className={styles.compactDesc}>{tech.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Action Button - visible after required steps completed */}
        {showInterestsSection && (
          <motion.div
            ref={actionButtonRef}
            className={styles.actionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.button
              className={`${styles.planButton} ${
                !isConfigComplete ? styles.disabled : ""
              }`}
              onClick={handlePlanTrip}
              disabled={!isConfigComplete}
              whileHover={isConfigComplete ? { scale: 1.05 } : {}}
              whileTap={isConfigComplete ? { scale: 0.95 } : {}}
            >
              {isConfigComplete
                ? "Create My Perfect Journey ✨"
                : "Complete the steps above"}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Sticky Progress Indicator - Apple-like floating widget with optional steps */}
      {completedRequiredSteps > 0 && (
        <motion.div
          className={`${styles.stickyProgress} ${
            allRequiredComplete ? styles.expanded : ""
          }`}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          layout
        >
          <div className={styles.stickyProgressContent}>
            {/* Required Steps Section */}
            <div className={styles.stickyProgressSection}>
              <div className={styles.stickyProgressSteps}>
                {[...Array(totalRequiredSteps)].map((_, index) => (
                  <motion.div
                    key={`required-${index}`}
                    className={`${styles.stickyProgressDot} ${
                      index < completedRequiredSteps ? styles.completed : ""
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    layout
                  />
                ))}
              </div>
              <p className={styles.stickyProgressText}>
                {allRequiredComplete ? (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.completedText}
                  >
                    ✓ Required
                  </motion.span>
                ) : (
                  `${completedRequiredSteps}/${totalRequiredSteps} required`
                )}
              </p>
            </div>

            {/* Optional Steps Section - Shows after required complete */}
            {allRequiredComplete && (
              <motion.div
                className={styles.stickyProgressSection}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className={styles.stickyProgressDivider} />
                <div className={styles.stickyProgressSteps}>
                  {[...Array(totalOptionalSteps)].map((_, index) => (
                    <motion.div
                      key={`optional-${index}`}
                      className={`${styles.stickyProgressDot} ${
                        styles.optional
                      } ${
                        index < completedOptionalSteps ? styles.completed : ""
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.4 + index * 0.1,
                        type: "spring",
                      }}
                      layout
                    />
                  ))}
                </div>
                <p className={styles.stickyProgressText}>
                  {completedOptionalSteps === totalOptionalSteps ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={styles.bonusText}
                    >
                      🎉 Bonus!
                    </motion.span>
                  ) : (
                    <span className={styles.optionalLabel}>
                      +{completedOptionalSteps}/{totalOptionalSteps} bonus
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </div>

          {/* Motivational Tooltip */}
          {allRequiredComplete &&
            completedOptionalSteps < totalOptionalSteps && (
              <motion.div
                className={styles.motivationalTooltip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className={styles.tooltipIcon}>💡</span>
                <span className={styles.tooltipText}>
                  Add interests & mood for better results!
                </span>
              </motion.div>
            )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TripSelector;
