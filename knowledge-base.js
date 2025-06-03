// Enhanced health remedy knowledge base with detailed tracking
const remedies = {
  headache: {
    natural: [
      {
        remedy: "Peppermint oil applied to temples",
        popularity: 85,
        lastUpdated: new Date(),
        benefits: ["Pain relief", "Muscle relaxation", "Improved focus"],
        preparation: "Dilute 2-3 drops in carrier oil, apply to temples",
        dosage: "Every 2 hours as needed",
        research: "PMID: 29154025"
      },
      {
        remedy: "Ginger tea (1 inch fresh ginger steeped in hot water)",
        popularity: 78,
        lastUpdated: new Date(),
        benefits: ["Anti-inflammatory", "Nausea relief", "Circulation"],
        preparation: "Slice fresh ginger, steep in hot water for 5-10 mins",
        dosage: "2-3 cups daily",
        research: "PMID: 25878704"
      },
      {
        remedy: "Lavender oil inhalation",
        popularity: 65,
        lastUpdated: new Date(),
        benefits: ["Stress relief", "Headache reduction", "Sleep aid"],
        preparation: "Add 2-3 drops to diffuser or tissue",
        dosage: "As needed",
        research: "PMID: 22517298"
      },
      {
        remedy: "Stay hydrated with water",
        popularity: 72,
        lastUpdated: new Date(),
        benefits: ["Prevents dehydration headaches", "Improves cognition"],
        preparation: "Drink room temperature water",
        dosage: "8 glasses daily",
        research: "PMID: 24179830"
      }
    ],
    pharmaceutical: [
      "Acetaminophen (Tylenol) - 500-1000mg every 4-6 hours",
      "Ibuprofen (Advil) - 200-400mg every 4-6 hours",
      "Aspirin - 325-650mg every 4 hours"
    ]
  },
  cold: {
    natural: [
      "Honey and lemon tea (1 tbsp honey + lemon juice in warm water)",
      "Eucalyptus steam inhalation (2-3 drops in hot water)",
      "Chicken soup with garlic and ginger",
      "Vitamin C rich foods (oranges, bell peppers)"
    ],
    pharmaceutical: [
      "Decongestants (pseudoephedrine)",
      "Antihistamines (loratadine)",
      "Cough suppressants (dextromethorphan)"
    ]
  },
  digestion: {
    natural: [
      "Peppermint tea",
      "Ginger tea (helps with nausea)",
      "Chamomile tea (soothes stomach)",
      "Probiotic foods (yogurt, kefir)"
    ],
    pharmaceutical: [
      "Antacids (Tums, Rolaids)",
      "H2 blockers (ranitidine)",
      "Proton pump inhibitors (omeprazole)"
    ]
  },
  // Additional remedy categories
  stress: {
    natural: [
      "Deep breathing exercises",
      "Meditation (10-15 minutes daily)",
      "Lavender aromatherapy",
      "Chamomile or passionflower tea"
    ],
    pharmaceutical: [
      "Consult a doctor for severe cases"
    ]
  },
  skin: {
    natural: [
      "Aloe vera gel for burns/sunburn",
      "Tea tree oil (diluted) for acne",
      "Oatmeal baths for irritation",
      "Coconut oil for dry skin"
    ],
    pharmaceutical: [
      "Hydrocortisone cream for itching",
      "Antibiotic ointment for cuts",
      "Antifungal creams for infections"
    ]
  }
};

// Common questions and responses
const commonQuestions = {
  greeting: [
    "Hello! I'm your health assistant. How can I help you today?",
    "Hi there! What health concern would you like advice on?"
  ],
  thanks: [
    "You're welcome! Let me know if you have other questions.",
    "Glad I could help! Stay healthy!"
  ],
  unknown: [
    "I specialize in natural and pharmaceutical remedies. Could you ask about a specific health concern?",
    "I'm still learning! Try asking about headaches, colds, digestion, or other common health issues."
  ]
};

// Enhanced trending algorithm with detailed metadata
function getTrendingRemedies() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const allRemedies = [];
  for (const condition in remedies) {
    if (remedies[condition].natural) {
      remedies[condition].natural.forEach(r => {
        if (new Date(r.lastUpdated) > oneWeekAgo) {
          allRemedies.push({
            name: r.remedy.split('(')[0].trim(),
            condition,
            popularity: r.popularity,
            image: `images/${r.remedy.split(' ')[0].toLowerCase()}.jpg`,
            benefits: r.benefits,
            preparation: r.preparation,
            research: r.research,
            effectiveness: `${Math.floor(r.popularity/10)}/10`
          });
        }
      });
    }
  }
  
  return allRemedies
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);
}

  // Comprehensive seasonal health advice
function getSeasonalTips() {
  const month = new Date().getMonth();
  const seasonData = {
    0: { // January
      tip: "Boost immunity with vitamin C during winter months",
      remedies: ["Citrus fruits", "Elderberry syrup", "Rose hip tea"],
      research: "PMID: 29099763",
      actions: [
        "Increase intake of vitamin C rich foods",
        "Consider supplementing during cold season",
        "Combine with zinc for enhanced effect"
      ]
    },
    1: { // February
      tip: "Protect skin from winter dryness",
      remedies: ["Coconut oil", "Oatmeal baths", "Aloe vera"],
      research: "PMID: 24305429",
      actions: [
        "Use moisturizer after showering",
        "Stay hydrated",
        "Use humidifier indoors"
      ]
    },
    2: { // March
      tip: "Prepare for seasonal allergies",
      remedies: ["Local honey", "Butterbur", "Quercetin-rich foods"],
      research: "PMID: 29168216",
      actions: [
        "Start allergy remedies before symptoms begin",
        "Keep windows closed on high pollen days",
        "Shower after outdoor activities"
      ]
    },
    3: { // April
      tip: "Spring detox with cleansing foods",
      remedies: ["Dandelion tea", "Lemon water", "Cruciferous vegetables"],
      research: "PMID: 25522674",
      actions: [
        "Increase water intake",
        "Add bitter greens to meals",
        "Reduce processed foods"
      ]
    },
    4: { // May
      tip: "Sun protection as days get longer",
      remedies: ["Aloe vera", "Green tea extract", "Astaxanthin"],
      research: "PMID: 24442058",
      actions: [
        "Apply sunscreen daily",
        "Wear protective clothing",
        "Eat antioxidant-rich foods"
      ]
    },
    5: { // June
      tip: "Stay hydrated in summer heat",
      remedies: ["Coconut water", "Watermelon", "Cucumber"],
      research: "PMID: 27304562",
      actions: [
        "Drink water before feeling thirsty",
        "Monitor urine color",
        "Replace electrolytes after sweating"
      ]
    },
    6: { // July
      tip: "Protect against summer bugs",
      remedies: ["Citronella oil", "Lemon eucalyptus", "Garlic"],
      research: "PMID: 27032554",
      actions: [
        "Use natural insect repellents",
        "Wear light-colored clothing",
        "Eliminate standing water"
      ]
    },
    7: { // August
      tip: "Support respiratory health during high pollen",
      remedies: ["Eucalyptus steam", "Nettle tea", "Omega-3s"],
      research: "PMID: 29149801",
      actions: [
        "Use air purifiers indoors",
        "Wash bedding frequently",
        "Try nasal irrigation"
      ]
    },
    8: { // September
      tip: "Prepare immune system for fall",
      remedies: ["Mushroom extracts", "Vitamin D", "Probiotics"],
      research: "PMID: 30251194",
      actions: [
        "Get flu shot if appropriate",
        "Prioritize sleep",
        "Manage stress levels"
      ]
    },
    9: { // October
      tip: "Support mental health as days shorten",
      remedies: ["St. John's Wort", "SAM-e", "Light therapy"],
      research: "PMID: 26390335",
      actions: [
        "Get morning sunlight",
        "Maintain social connections",
        "Exercise regularly"
      ]
    },
    10: { // November
      tip: "Boost immunity before holiday season",
      remedies: ["Echinacea", "Ginseng", "Garlic"],
      research: "PMID: 30670255",
      actions: [
        "Wash hands frequently",
        "Disinfect high-touch surfaces",
        "Prioritize rest"
      ]
    },
    11: { // December
      tip: "Combat holiday stress with chamomile tea",
      remedies: ["Chamomile tea", "Lavender aromatherapy", "Magnesium-rich foods"],
      research: "PMID: 26483209",
      actions: [
        "Drink 1-2 cups chamomile tea daily",
        "Practice mindful breathing",
        "Maintain sleep schedule"
      ]
    }
  };
  return seasonData[month];
}

export { remedies, commonQuestions, getTrendingRemedies, getSeasonalTips };
