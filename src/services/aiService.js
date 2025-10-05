/**
 * 🤖 Google AI (Gemini) Service
 * 
 * Handles AI-powered trip planning and itinerary generation
 * Uses Google's Gemini Pro model for intelligent travel recommendations
 * 
 * Features:
 * - Personalized itinerary generation
 * - Day-by-day planning
 * - Activity recommendations
 * - Time optimization
 * - Budget consideration
 * - Accessibility accommodation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_AI_MODEL || "gemini-2.0-flash-exp";
const TEMPERATURE = parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7;
const MAX_TOKENS = parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 8192;

let genAI;
let model;

// Initialize AI on first use
const initializeAI = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: TEMPERATURE,
        maxOutputTokens: MAX_TOKENS,
      },
    });
  }
  return model;
};

/**
 * Generate a complete trip itinerary based on user preferences
 * 
 * @param {Object} tripData - Trip configuration from TripSelector
 * @returns {Promise<Object>} Generated itinerary with days, activities, tips
 */
export const generateTripItinerary = async (tripData) => {
  const aiModel = initializeAI();
  
  if (!aiModel) {
    throw new Error('Google AI API key not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.');
  }

  // Build comprehensive prompt
  const prompt = buildItineraryPrompt(tripData);
  
  try {
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse AI response into structured format
    return parseItineraryResponse(text, tripData);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
};

/**
 * Build a detailed prompt for the AI based on trip configuration
 */
const buildItineraryPrompt = (tripData) => {
  const {
    destination,
    location,
    group,
    duration,
    customDays,
    budget,
    interests,
    mood,
    accessibility,
    ageGroups,
    season,
    experience,
    dietary,
    pace,
    accommodation,
    transport,
    tech,
  } = tripData;

  // Calculate trip duration
  const days = getDurationInDays(duration, customDays);

  // Build prompt sections
  const sections = [];

  // Extract destination name properly
  const destinationName = location?.display_name || location?.name || destination;
  const cityName = destinationName.split(',')[0].trim(); // Get city name without country
  const country = location?.address?.country || destinationName.split(',').pop()?.trim();
  
  // Current date for context
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Header - Apple-like, inspiring tone
  sections.push(`You are a world-class travel expert crafting an unforgettable journey to ${cityName}${country ? ', ' + country : ''}.`);
  sections.push('Create an experience that feels effortless, inspiring, and perfectly tailored.');
  sections.push('');
  sections.push(`IMPORTANT CONTEXT:`);
  sections.push(`- Current date: ${currentDate}`);
  sections.push(`- You MUST verify all recommendations exist and are currently operational`);
  sections.push(`- Use REAL, VERIFIED locations - no fictional or closed establishments`);
  sections.push(`- Check business hours, seasonal closures, and current accessibility`);
  sections.push(`- Provide accurate addresses that can be found on maps`);
  sections.push('');

  // Trip Overview
  sections.push('TRIP OVERVIEW:');
  sections.push(`- Destination: ${destinationName}`);
  sections.push(`- Duration: ${days} day${days > 1 ? 's' : ''}`);
  sections.push(`- Travel Group: ${formatTravelGroup(group)}`);
  sections.push(`- Budget: ${formatBudget(budget)}`);
  sections.push(`- Trip Mood: ${mood || 'balanced'}`);
  sections.push('');

  // Traveler Preferences
  if (interests && interests.length > 0) {
    sections.push('INTERESTS:');
    sections.push(`- ${interests.join(', ')}`);
    sections.push('');
  }

  // Special Requirements
  const specialReqs = [];
  if (accessibility && accessibility.length > 0) {
    specialReqs.push(`Accessibility needs: ${accessibility.join(', ')}`);
  }
  if (dietary && dietary.length > 0 && !dietary.includes('no_restrictions')) {
    specialReqs.push(`Dietary restrictions: ${dietary.join(', ')}`);
  }
  if (ageGroups && ageGroups.length > 0) {
    specialReqs.push(`Age groups: ${ageGroups.join(', ')}`);
  }
  if (specialReqs.length > 0) {
    sections.push('SPECIAL REQUIREMENTS:');
    specialReqs.forEach(req => sections.push(`- ${req}`));
    sections.push('');
  }

  // Travel Details
  sections.push('TRAVEL DETAILS:');
  if (season) sections.push(`- Preferred season: ${season}`);
  if (experience) sections.push(`- Travel experience level: ${experience}`);
  if (pace) sections.push(`- Activity pace: ${pace}`);
  if (accommodation) sections.push(`- Accommodation type: ${accommodation}`);
  if (transport && transport.length > 0) {
    sections.push(`- Transportation preferences: ${transport.join(', ')}`);
  }
  if (tech) sections.push(`- Tech setup: ${tech}`);
  sections.push('');

  // Instructions
  sections.push('INSTRUCTIONS:');
  sections.push('Create a detailed day-by-day itinerary in JSON format with the following structure:');
  sections.push('');
  sections.push('{');
  sections.push('  "summary": {');
  sections.push('    "title": "Trip title",');
  sections.push('    "description": "Brief overview",');
  sections.push('    "highlights": ["highlight1", "highlight2", "highlight3"],');
  sections.push('    "bestTime": "When to visit",');
  sections.push('    "estimatedCost": "Cost range"');
  sections.push('  },');
  sections.push('  "days": [');
  sections.push('    {');
  sections.push('      "day": 1,');
  sections.push('      "title": "Day title",');
  sections.push('      "theme": "Daily theme",');
  sections.push('      "activities": [');
  sections.push('        {');
  sections.push('          "time": "09:00",');
  sections.push('          "title": "Activity name",');
  sections.push('          "description": "Detailed description",');
  sections.push('          "duration": "2 hours",');
  sections.push('          "type": "sightseeing|food|activity|transport|rest",');
  sections.push('          "cost": "€€",');
  sections.push('          "tips": ["tip1", "tip2"],');
  sections.push('          "location": "Address or area"');
  sections.push('        }');
  sections.push('      ]');
  sections.push('    }');
  sections.push('  ],');
  sections.push('  "tips": {');
  sections.push('    "transportation": ["tip1", "tip2"],');
  sections.push('    "safety": ["tip1", "tip2"],');
  sections.push('    "cultural": ["tip1", "tip2"],');
  sections.push('    "budgeting": ["tip1", "tip2"],');
  sections.push('    "packing": ["tip1", "tip2"]');
  sections.push('  },');
  sections.push('  "recommendations": {');
  sections.push('    "restaurants": [{name, cuisine, priceRange, mustTry}],');
  sections.push('    "accommodations": [{name, type, area, priceRange}],');
  sections.push('    "localExperiences": [{name, description, duration}]');
  sections.push('  }');
  sections.push('}');
  sections.push('');
  sections.push('DESIGN PRINCIPLES (Apple-like Philosophy):');
  sections.push('✨ Simplicity: Every detail should be intentional and clear');
  sections.push('💫 Delight: Create moments that surprise and inspire');
  sections.push('🌊 Flow: Seamless transitions between activities, no wasted time');
  sections.push('💎 Quality over quantity: Curate the best, not just more options');
  sections.push('♿ Accessibility: Make every experience welcoming and inclusive');
  sections.push('🏡 Local authenticity: Recommend places where locals actually go');
  sections.push('');
  sections.push('TECHNICAL REQUIREMENTS:');
  sections.push('- Return ONLY valid JSON (no markdown code blocks, no extra text)');
  sections.push('- Plan realistic timing with buffer for travel, meals, and spontaneity');
  sections.push('- Respect budget constraints while maximizing value');
  sections.push('- Include specific addresses and practical navigation tips');
  sections.push('- Balance energy levels throughout the day (high → medium → low → rest)');
  sections.push(`- Create exactly ${days} day${days > 1 ? 's' : ''} of activities`);
  sections.push('- Use clear, concise, inspiring language (avoid robotic descriptions)');
  sections.push('- Add insider tips that make travelers feel like locals');

  return sections.join('\n');
};

/**
 * Parse AI response into structured itinerary
 */
const parseItineraryResponse = (text, tripData) => {
  try {
    // Extract JSON from response (AI might add markdown formatting)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const itinerary = JSON.parse(jsonMatch[0]);

    // Add metadata
    itinerary.metadata = {
      generatedAt: new Date().toISOString(),
      destination: tripData.destination,
      location: tripData.location,
      configuration: {
        group: tripData.group,
        duration: tripData.duration,
        budget: tripData.budget,
        interests: tripData.interests,
        mood: tripData.mood,
      },
    };

    // Validate structure
    if (!itinerary.days || !Array.isArray(itinerary.days)) {
      throw new Error('Invalid itinerary structure: missing days array');
    }

    return itinerary;
  } catch (error) {
    console.error('Parse Error:', error);
    console.log('Raw AI Response:', text);
    
    // Return fallback structure
    return createFallbackItinerary(tripData);
  }
};

/**
 * Create fallback itinerary if AI fails
 */
const createFallbackItinerary = (tripData) => {
  const days = getDurationInDays(tripData.duration, tripData.customDays);
  
  return {
    summary: {
      title: `${days}-Day Trip to ${tripData.destination}`,
      description: `Explore the best of ${tripData.destination} with this personalized itinerary.`,
      highlights: [
        'Discover local culture and attractions',
        'Taste authentic cuisine',
        'Experience hidden gems',
      ],
      bestTime: 'Year-round',
      estimatedCost: formatBudget(tripData.budget),
    },
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Exploring ${tripData.destination}`,
      theme: 'Discovery',
      activities: [
        {
          time: '09:00',
          title: 'Morning Exploration',
          description: 'Start your day exploring the local area',
          duration: '3 hours',
          type: 'sightseeing',
          cost: '€€',
          tips: ['Arrive early to avoid crowds', 'Bring water and sunscreen'],
          location: tripData.destination,
        },
      ],
    })),
    tips: {
      transportation: ['Use local public transport', 'Consider walking when possible'],
      safety: ['Keep valuables secure', 'Stay aware of surroundings'],
      cultural: ['Respect local customs', 'Learn basic phrases'],
      budgeting: ['Set daily spending limits', 'Look for combo deals'],
      packing: ['Pack light', 'Bring comfortable shoes'],
    },
    recommendations: {
      restaurants: [],
      accommodations: [],
      localExperiences: [],
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      destination: tripData.destination,
      isFallback: true,
    },
  };
};

/**
 * Helper: Get duration in days
 */
const getDurationInDays = (duration, customDays) => {
  if (duration === 'custom' && customDays) {
    return parseInt(customDays);
  }
  
  const durationMap = {
    '1day': 1,
    'weekend': 2,
    'week': 7,
  };
  
  return durationMap[duration] || 3;
};

/**
 * Helper: Format travel group
 */
const formatTravelGroup = (group) => {
  const groupMap = {
    solo: 'Solo Traveler',
    couple: 'Couple',
    family: 'Family with children',
    friends: 'Group of friends',
  };
  return groupMap[group] || group;
};

/**
 * Helper: Format budget
 */
const formatBudget = (budget) => {
  const budgetMap = {
    budget: 'Budget-friendly (< $50/day)',
    moderate: 'Moderate ($50-150/day)',
    luxury: 'Luxury ($150+/day)',
  };
  return budgetMap[budget] || budget;
};

/**
 * Validate API key configuration
 */
export const validateApiKey = () => {
  return !!API_KEY && API_KEY !== 'your_google_ai_api_key_here';
};

/**
 * Get API configuration status
 */
export const getApiStatus = () => {
  return {
    configured: validateApiKey(),
    model: MODEL_NAME,
    temperature: TEMPERATURE,
    maxTokens: MAX_TOKENS,
  };
};
