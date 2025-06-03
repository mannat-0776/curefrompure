// Natural language processing utilities
export function findBestMatch(input, options) {
  input = input.toLowerCase();
  const words = input.split(/\s+/);
  
  // Score each option based on word matches
  const scoredOptions = options.map(option => {
    const optionWords = option.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (optionWords.includes(word)) {
        score += 2; // Exact word match
      } else if (optionWords.some(ow => ow.includes(word))) {
        score += 1; // Partial word match
      }
    });
    
    return { option, score };
  });

  // Return the highest scoring option
  scoredOptions.sort((a, b) => b.score - a.score);
  return scoredOptions[0].score > 0 ? scoredOptions[0].option : null;
}

export function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

export function extractKeywords(input) {
  const healthKeywords = [
    'headache', 'migraine', 'pain',
    'cold', 'flu', 'cough', 'sore throat', 'congestion',
    'stomach', 'digestion', 'nausea', 'indigestion', 'heartburn',
    'stress', 'anxiety', 'relax',
    'skin', 'acne', 'rash', 'dryness', 'irritation',
    'sleep', 'insomnia', 'tired',
    'allergy', 'sneezing', 'itchy eyes'
  ];

  const foundKeywords = healthKeywords.filter(keyword => 
    input.toLowerCase().includes(keyword)
  );

  return foundKeywords.length > 0 ? foundKeywords : null;
}

export function isGreeting(text) {
  const greetings = ['hello', 'hi', 'hey', 'greetings'];
  return greetings.some(g => text.toLowerCase().startsWith(g));
}

export function isThanks(text) {
  const thanks = ['thanks', 'thank you', 'appreciate'];
  return thanks.some(t => text.toLowerCase().includes(t));
}
