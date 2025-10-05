/**
 * 🪝 USE LOCATION SEARCH HOOK
 * 
 * Custom hook for location search with debouncing and state management
 * Follows React best practices: separation of concerns, reusability
 * 
 * Features:
 * - Debounced search (300ms delay)
 * - Loading states
 * - Error handling
 * - Automatic cleanup
 * - Result caching (optional)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchLocations, sortByImportance } from '../services/geocoding';

/**
 * Hook for location search with autocomplete
 * 
 * @param {Object} options - Hook options
 * @param {number} options.debounceDelay - Debounce delay in ms (default: 300)
 * @param {number} options.minQueryLength - Min characters before search (default: 2)
 * @param {number} options.maxResults - Max results to return (default: 10)
 * @returns {Object} Search state and methods
 */
export function useLocationSearch(options = {}) {
  const {
    debounceDelay = 300,
    minQueryLength = 2,
    maxResults = 10,
  } = options;

  // State management
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for cleanup and cancellation
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  /**
   * Perform search (memoized to prevent recreation)
   */
  const performSearch = useCallback(async (searchQuery) => {
    console.log('🔍 performSearch called with:', searchQuery);
    
    // Guard: Skip if query too short
    if (searchQuery.length < minQueryLength) {
      console.log('⚠️ Query too short, clearing results');
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    console.log('⏳ Setting isLoading = true');
    setIsLoading(true);
    setError(null);

    try {
      const locations = await searchLocations(searchQuery, {
        limit: maxResults,
        signal: controller.signal,
      });

      console.log('✅ Got locations:', locations.length, locations);

      // Update state with results
      const sortedLocations = sortByImportance(locations);
      console.log('📊 Setting results:', sortedLocations.length);
      setResults(sortedLocations);
      
    } catch (err) {
      console.error('🚨 Search error:', err);
      if (err.name === 'AbortError') {
        console.log('🛑 Search aborted - query changed');
        // Don't update state on abort, new search will handle it
        return;
      } else {
        setError(err.message || 'Failed to load locations');
        setResults([]);
      }
    } finally {
      // Always set loading to false when this request completes
      // Only if this controller is still the active one (not aborted)
      if (abortControllerRef.current === controller) {
        console.log('✅ Setting isLoading = false');
        setIsLoading(false);
        abortControllerRef.current = null;
      } else {
        console.log('⏭️ Skipping isLoading=false (newer request in progress)');
      }
    }
  }, [minQueryLength, maxResults]);

  /**
   * Effect: Trigger search when query changes
   * Using direct debounced call to avoid stale closures
   */
  useEffect(() => {
    if (query.trim().length >= minQueryLength) {
      // Set loading immediately
      setIsLoading(true);
      
      // Create debounced search
      const timeoutId = setTimeout(() => {
        performSearch(query.trim());
      }, debounceDelay);
      
      // Cleanup: cancel timeout if query changes
      return () => clearTimeout(timeoutId);
    } else {
      // Clear results if query too short
      setResults([]);
      setIsLoading(false);
    }
  }, [query, minQueryLength, debounceDelay, performSearch]);

  /**
   * Effect: Set mounted flag and cleanup on unmount
   */
  useEffect(() => {
    // Set mounted on mount
    isMountedRef.current = true;
    console.log('✅ Component mounted, isMountedRef = true');
    
    return () => {
      console.log('🔴 Component unmounting, isMountedRef = false');
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  /**
   * Clear search results and query
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setIsLoading(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Public API
   */
  return {
    // State
    query,
    results,
    isLoading,
    error,
    hasResults: results.length > 0,
    isEmpty: query.length >= minQueryLength && results.length === 0 && !isLoading,

    // Methods
    setQuery,
    clearSearch,
  };
}
