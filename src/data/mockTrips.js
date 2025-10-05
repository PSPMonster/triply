// Mock data for demo trips - optimized for "calm travel" concept

export const mockTrips = {
  lisbon: {
    id: 'lisbon-calm',
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Breathe in the Atlantic breeze',
    duration: '3 days',
    vibe: 'Relax & Culture',
    ecoScore: 85,
    stressLevel: 'Low',
    coverImage: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200',
    days: [
      {
        day: 1,
        theme: 'Gentle Introduction',
        activities: [
          {
            id: 'l1',
            time: '09:00',
            duration: '2h',
            name: 'Jardim da Estrela',
            type: 'nature',
            description: 'Start your journey in this tranquil garden. Listen to birds, feel the morning sun, breathe.',
            emotionalNote: 'This place lets you catch your breath',
            noiseLevel: 20,
            ecoFriendly: true,
            cost: 0,
            location: { lat: 38.7139, lng: -9.1600 },
            transport: 'Walk from accommodation',
            image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800'
          },
          {
            id: 'l2',
            time: '11:30',
            duration: '1.5h',
            name: 'Ler Devagar Bookstore',
            type: 'culture',
            description: 'A peaceful bookstore in an old factory. Browse slowly, discover Portuguese literature.',
            emotionalNote: 'Time moves differently here',
            noiseLevel: 15,
            ecoFriendly: true,
            cost: 0,
            location: { lat: 38.7075, lng: -9.1767 },
            transport: 'Tram 15 (10 min)',
            image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'
          },
          {
            id: 'l3',
            time: '14:00',
            duration: '2h',
            name: 'LX Factory Lunch',
            type: 'food',
            description: 'Organic café with terrace views. Try the vegan pastel de nata.',
            emotionalNote: 'Taste local, think global',
            noiseLevel: 35,
            ecoFriendly: true,
            cost: 15,
            location: { lat: 38.7069, lng: -9.1755 },
            transport: 'Walk (5 min)',
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'
          },
          {
            id: 'l4',
            time: '17:00',
            duration: '1h',
            name: 'Miradouro de Santa Catarina',
            type: 'viewpoint',
            description: 'Watch the sunset with locals. Bring a book, or just be present.',
            emotionalNote: 'The best view in Lisbon, without the crowds',
            noiseLevel: 25,
            ecoFriendly: true,
            cost: 0,
            location: { lat: 38.7097, lng: -9.1489 },
            transport: 'Tram 28 (15 min)',
            image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800'
          }
        ]
      },
      {
        day: 2,
        theme: 'Coast & Culture',
        activities: [
          {
            id: 'l5',
            time: '08:30',
            duration: '3h',
            name: 'Cascais Beach Walk',
            type: 'nature',
            description: 'Early train to the coast. Walk barefoot on Guincho Beach, feel the sand.',
            emotionalNote: 'The ocean has a way of putting things in perspective',
            noiseLevel: 30,
            ecoFriendly: true,
            cost: 5,
            location: { lat: 38.7338, lng: -9.4751 },
            transport: 'Train from Cais do Sodré (40 min)',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
          },
          {
            id: 'l6',
            time: '13:00',
            duration: '2h',
            name: 'Time Out Market',
            type: 'food',
            description: 'Curated food hall. Sample Portuguese flavors, meet friendly vendors.',
            emotionalNote: 'Every dish tells a story',
            noiseLevel: 50,
            ecoFriendly: false,
            cost: 20,
            location: { lat: 38.7070, lng: -9.1457 },
            transport: 'Train back + Walk (10 min)',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
          },
          {
            id: 'l7',
            time: '16:00',
            duration: '2h',
            name: 'Fado Evening Prep',
            type: 'culture',
            description: 'Explore Alfama district slowly. Get lost in narrow streets, discover hidden tiles.',
            emotionalNote: 'This is where Lisbon whispers its secrets',
            noiseLevel: 20,
            ecoFriendly: true,
            cost: 0,
            location: { lat: 38.7142, lng: -9.1288 },
            transport: 'Tram 28 (20 min)',
            image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800'
          },
          {
            id: 'l8',
            time: '20:00',
            duration: '2.5h',
            name: 'Intimate Fado House',
            type: 'culture',
            description: 'Small, authentic fado performance. Let the soulful music move you.',
            emotionalNote: 'Feel the saudade - Portuguese longing',
            noiseLevel: 40,
            ecoFriendly: true,
            cost: 35,
            location: { lat: 38.7126, lng: -9.1290 },
            transport: 'Walk (5 min)',
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'
          }
        ]
      },
      {
        day: 3,
        theme: 'Mindful Farewell',
        activities: [
          {
            id: 'l9',
            time: '09:00',
            duration: '2h',
            name: 'Belém Morning',
            type: 'culture',
            description: 'Visit Jerónimos Monastery early (before crowds). Marvel at the architecture in peace.',
            emotionalNote: 'History feels alive in the quiet',
            noiseLevel: 25,
            ecoFriendly: true,
            cost: 10,
            location: { lat: 38.6979, lng: -9.2062 },
            transport: 'Tram 15 (25 min)',
            image: 'https://images.unsplash.com/photo-1585059895524-72359e6d9126?w=800'
          },
          {
            id: 'l10',
            time: '11:30',
            duration: '1h',
            name: 'Pastéis de Belém',
            type: 'food',
            description: 'The original custard tart, still warm from the oven. Pure joy.',
            emotionalNote: 'Sometimes happiness is this simple',
            noiseLevel: 45,
            ecoFriendly: false,
            cost: 5,
            location: { lat: 38.6976, lng: -9.2034 },
            transport: 'Walk (3 min)',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'
          },
          {
            id: 'l11',
            time: '13:00',
            duration: '2h',
            name: 'MAAT Museum',
            type: 'culture',
            description: 'Modern art by the river. Clean lines, open spaces, thought-provoking exhibits.',
            emotionalNote: 'Where art meets the water',
            noiseLevel: 20,
            ecoFriendly: true,
            cost: 12,
            location: { lat: 38.6967, lng: -9.1973 },
            transport: 'Walk along the river (8 min)',
            image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
          },
          {
            id: 'l12',
            time: '16:00',
            duration: '1.5h',
            name: 'Reflection at Cristo Rei',
            type: 'viewpoint',
            description: 'Take the ferry across the Tagus. See Lisbon from above, reflect on your journey.',
            emotionalNote: 'Every ending is a new beginning',
            noiseLevel: 30,
            ecoFriendly: true,
            cost: 6,
            location: { lat: 38.6789, lng: -9.1711 },
            transport: 'Ferry + Bus (30 min total)',
            image: 'https://images.unsplash.com/photo-1555881400-69d1cf4e4b0e?w=800'
          }
        ]
      }
    ]
  },
  
  krakow: {
    id: 'krakow-slow',
    city: 'Kraków',
    country: 'Poland',
    tagline: 'Walk through centuries, slowly',
    duration: '2 days',
    vibe: 'Culture & Relax',
    ecoScore: 90,
    stressLevel: 'Very Low',
    coverImage: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d7f7?w=1200',
    days: [
      {
        day: 1,
        theme: 'Old Town Serenity',
        activities: [
          {
            id: 'k1',
            time: '08:00',
            duration: '2h',
            name: 'Planty Park Morning Walk',
            type: 'nature',
            description: 'Circle the Old Town through green gardens. Morning mist, bird songs, empty paths.',
            emotionalNote: 'The city wakes up with you',
            noiseLevel: 15,
            ecoFriendly: true,
            cost: 0,
            location: { lat: 50.0619, lng: 19.9368 },
            transport: 'Walk from accommodation',
            image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800'
          },
          {
            id: 'k2',
            time: '10:30',
            duration: '1.5h',
            name: 'St. Mary\'s Basilica',
            type: 'culture',
            description: 'Witness the hourly trumpet call. Admire Veit Stoss altarpiece in peace.',
            emotionalNote: 'Tradition echoes through time',
            noiseLevel: 30,
            ecoFriendly: true,
            cost: 8,
            location: { lat: 50.0617, lng: 19.9396 },
            transport: 'Walk (10 min)',
            image: 'https://images.unsplash.com/photo-1591194010508-487bbed94776?w=800'
          },
          {
            id: 'k3',
            time: '13:00',
            duration: '1.5h',
            name: 'Vegan Lunch at Green Way',
            type: 'food',
            description: 'Cozy vegetarian spot. Try Polish pierogi with modern twist.',
            emotionalNote: 'Comfort food for the soul',
            noiseLevel: 25,
            ecoFriendly: true,
            cost: 12,
            location: { lat: 50.0637, lng: 19.9384 },
            transport: 'Walk (5 min)',
            image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800'
          },
          {
            id: 'k4',
            time: '15:30',
            duration: '2h',
            name: 'Wawel Castle Gardens',
            type: 'culture',
            description: 'Explore the royal castle at your pace. Find a bench with a river view.',
            emotionalNote: 'Kings and queens once walked here',
            noiseLevel: 35,
            ecoFriendly: true,
            cost: 10,
            location: { lat: 50.0544, lng: 19.9353 },
            transport: 'Walk (15 min)',
            image: 'https://images.unsplash.com/photo-1551894543-b3a7e4447f28?w=800'
          },
          {
            id: 'k5',
            time: '18:00',
            duration: '2h',
            name: 'Kazimierz District Stroll',
            type: 'culture',
            description: 'Wander through the Jewish quarter. Street art, cozy cafés, living history.',
            emotionalNote: 'Every corner tells a story of resilience',
            noiseLevel: 30,
            ecoFriendly: true,
            cost: 0,
            location: { lat: 50.0520, lng: 19.9467 },
            transport: 'Walk (12 min)',
            image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800'
          }
        ]
      },
      {
        day: 2,
        theme: 'Nature & Reflection',
        activities: [
          {
            id: 'k6',
            time: '07:00',
            duration: '4h',
            name: 'Zakopane Mountain Escape',
            type: 'nature',
            description: 'Early trip to Tatra Mountains. Breathe mountain air, walk forest trails.',
            emotionalNote: 'Nature heals what life bruises',
            noiseLevel: 20,
            ecoFriendly: true,
            cost: 25,
            location: { lat: 49.2992, lng: 19.9496 },
            transport: 'Shared eco-minibus (2h)',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
          },
          {
            id: 'k7',
            time: '13:00',
            duration: '1.5h',
            name: 'Highlander Lunch',
            type: 'food',
            description: 'Traditional mountain cuisine. Warm, hearty, made with love.',
            emotionalNote: 'Food tastes better in the mountains',
            noiseLevel: 35,
            ecoFriendly: true,
            cost: 15,
            location: { lat: 49.2991, lng: 19.9545 },
            transport: 'Walk (5 min)',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'
          },
          {
            id: 'k8',
            time: '17:00',
            duration: '2h',
            name: 'Return & Relax',
            type: 'wellness',
            description: 'Back to Kraków. Evening at thermal baths or quiet café with journal.',
            emotionalNote: 'Process your journey, honor your experience',
            noiseLevel: 20,
            ecoFriendly: true,
            cost: 20,
            location: { lat: 50.0647, lng: 19.9450 },
            transport: 'Minibus back (2h)',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
          }
        ]
      }
    ]
  }
};

export const moodProfiles = {
  relax: {
    name: 'Relax',
    icon: '🌊',
    description: 'Slow pace, nature, mindfulness',
    color: '#93C5FD'
  },
  culture: {
    name: 'Culture',
    icon: '🎭',
    description: 'Museums, local life, authentic experiences',
    color: '#C4B5FD'
  },
  adventure: {
    name: 'Adventure',
    icon: '🏔️',
    description: 'Active, exploration, memorable moments',
    color: '#FCA5A5'
  }
};
