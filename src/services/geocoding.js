/**
 * 🌍 GEOCODING SERVICE - Nominatim (OpenStreetMap) Integration
 * 
 * Provides location search and autocomplete functionality
 * using Nominatim's completely free API (no registration needed!)
 * 
 * Features:
 * - City/country autocomplete
 * - Debounced search to minimize API calls
 * - Result filtering (cities only)
 * - Error handling with graceful degradation
 * 
 * Docs: https://nominatim.org/release-docs/latest/api/Search/
 * Rate Limit: 1 request/second (debouncing handles this)
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Search for locations using Nominatim (OpenStreetMap) API
 * 
 * @param {string} query - Search query (city name, country, etc.)
 * @param {Object} options - Search options
 * @param {number} options.limit - Max results (default: 10)
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocations(query, options = {}) {
  // Guard: Skip empty queries
  if (!query || query.trim().length < 2) {
    return [];
  }

  const { limit = 10 } = options;

  try {
    // Build query parameters for Nominatim
    const params = new URLSearchParams({
      q: query.trim(),
      format: 'json',
      limit: limit.toString(),
      addressdetails: '1',
      // Filter: only cities, towns, villages
      featuretype: 'city',
      // Important: Nominatim requires User-Agent
      'accept-language': 'en',
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        // Required by Nominatim terms of service
        'User-Agent': 'Triply/1.0 (travel planning app)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform API results to our format
    return transformNominatimResults(data || []);
  } catch (error) {
    console.error('🚨 Geocoding error:', error);
    
    // Graceful degradation: return empty array
    // UI will show "No results" instead of crashing
    return [];
  }
}

/**
 * Transform Nominatim results to simplified format
 * 
 * @param {Array} results - Raw Nominatim results
 * @returns {Array} Transformed location objects
 */
function transformNominatimResults(results) {
  // 🐛 DEBUG: Log raw results
  console.log('📦 Raw Nominatim results:', results.length, results);

  // Don't filter - show all results (we can add filtering later if needed)
  // Nominatim already returns relevant results based on our query
  return results.map(result => {
      const addr = result.address || {};
      
      return {
        // Unique ID for React keys
        id: result.place_id || result.osm_id,
        
        // Display name (e.g., "Kraków, Poland")
        name: formatNominatimName(result),
        
        // City name only
        city: addr.city || addr.town || addr.village || result.name,
        
        // Country name
        country: addr.country,
        
        // Country code (ISO 2-letter, e.g., "PL")
        countryCode: addr.country_code?.toUpperCase(),
        
        // State/region (if applicable)
        state: addr.state || addr.region,
        
        // Coordinates
        coordinates: {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        },
        
        // Population (Nominatim doesn't provide this, use importance instead)
        population: Math.round(parseFloat(result.importance || 0) * 1000000),
        
        // Place type (city, town, village, etc.)
        type: result.type || 'city',
        
        // Full address
        formatted: result.display_name,
      };
    });
}

/**
 * Format Nominatim location name for display
 * Priority: City, Country
 * 
 * @param {Object} result - Nominatim result
 * @returns {string} Formatted name
 */
function formatNominatimName(result) {
  const addr = result.address || {};
  const city = addr.city || addr.town || addr.village || result.name;
  const country = addr.country;
  
  if (city && country) {
    return `${city}, ${country}`;
  }
  
  return city || country || result.display_name || 'Unknown Location';
}

/**
 * Debounce utility - delays function execution until user stops typing
 * Prevents excessive API calls during rapid input
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    // Clear previous timeout
    clearTimeout(timeoutId);
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Sort locations by importance
 * Priority: Population > Type (city > town > village)
 * 
 * @param {Array} locations - Location results
 * @returns {Array} Sorted locations
 */
export function sortByImportance(locations) {
  return locations.sort((a, b) => {
    // Sort by population (descending)
    if (a.population && b.population) {
      return b.population - a.population;
    }
    
    // Cities before towns before villages
    const typeOrder = { city: 1, town: 2, village: 3 };
    const aOrder = typeOrder[a.type] || 99;
    const bOrder = typeOrder[b.type] || 99;
    
    return aOrder - bOrder;
  });
}

/**
 * Get location thumbnail from Unsplash
 * Fallback for locations without images
 * 
 * @param {string} cityName - City name
 * @returns {string} Image URL
 */
export function getLocationThumbnail(cityName) {
  // Unsplash random image with city query
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(cityName)},travel,city`;
}
