import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LandingPage, TripSelector, TripView } from "./pages";
import TripViewAI from "./pages/TripViewAI";
import LoaderDemo from "./pages/LoaderDemo";
import "./App.css";

// 🎬 Animated Routes Wrapper - handles scroll reset + page transitions
function AnimatedRoutes() {
  const location = useLocation();

  // 📜 Scroll Reset: Always start at top when route changes
  // Apple-like behavior: new page = fresh canvas
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🏠 Home - Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 🗺️ Explore - Destination Selector */}
        <Route path="/explore" element={<TripSelector />} />

        {/* ✈️ Trip - AI-Generated Itinerary View */}
        {/* Example: /trip/lisbon or /trip/krakow */}
        <Route path="/trip/:cityId" element={<TripViewAI />} />

        {/* 🗺️ Legacy Trip View (mock data) */}
        <Route path="/trip-mock/:cityId" element={<TripView />} />

        {/* 🎨 Loader Demo - Test global loader */}
        <Route path="/loader-demo" element={<LoaderDemo />} />

        {/* 404 - Redirect to home (optional) */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
