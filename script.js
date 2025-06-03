import { remedies, commonQuestions } from './knowledge-base.js';
import { 
    findBestMatch, 
    getRandomResponse, 
    extractKeywords, 
    isGreeting, 
    isThanks 
} from './nlp-utils.js';

document.addEventListener("DOMContentLoaded", function () {
    // Load seasonal tip
    const seasonalTip = getSeasonalTips();
    loadSeasonalTip(seasonalTip);

    // Cross-page search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-btn');
    
    // Page content data
    const pageIndex = [
        {
            url: 'index.html',
            title: 'Home',
            content: 'Healing Naturally, Caring Wisely. Discover the best natural and pharmacy remedies for your health.'
        },
        {
            url: 'about.html',
            title: 'About Us',
            content: 'Learn about our mission to provide natural and pharmaceutical health solutions.'
        },
        {
            url: 'solutions.html',
            title: 'Health Solutions',
            content: 'Comprehensive health solutions for various conditions and symptoms.'
        },
        {
            url: 'remedies.html',
            title: 'Natural Remedies',
            content: 'Traditional and modern natural remedies for common ailments.'
        },
        {
            url: 'products.html',
            title: 'Our Products',
            content: 'High-quality health products for your wellness needs.'
        },
        {
            url: 'blog.html',
            title: 'Health Blog',
            content: 'Articles and tips about natural health and wellness.'
        }
    ];

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.style.display = 'none';
    searchInput.parentNode.appendChild(resultsContainer);

    function performSearch(query) {
        if (!query.trim()) {
            resultsContainer.style.display = 'none';
            return;
        }

        // First try to find matching remedies
        const remedyResults = searchRemedies(query);
        if (remedyResults.length > 0) {
            displayRemedyResults(remedyResults);
            return;
        }

        // Fall back to page search if no remedy matches
        const pageResults = pageIndex.filter(page => 
            page.title.toLowerCase().includes(query.toLowerCase()) || 
            page.content.toLowerCase().includes(query.toLowerCase())
        );
        displayPageResults(pageResults);
    }

    function searchRemedies(query) {
        const keywords = extractKeywords(query);
        if (!keywords) return [];

        const allRemedies = [];
        for (const condition in remedies) {
            // Search natural remedies
            if (remedies[condition].natural) {
                remedies[condition].natural.forEach(remedy => {
                    const remedyText = typeof remedy === 'string' ? remedy : remedy.remedy;
                    if (remedyText.toLowerCase().includes(query.toLowerCase()) ||
                        findBestMatch(query, [condition]).toLowerCase() === condition.toLowerCase()) {
                        allRemedies.push({
                            type: 'natural',
                            condition,
                            remedy: remedy,
                            image: `images/${remedyText.split(' ')[0].toLowerCase()}.jpg`
                        });
                    }
                });
            }

            // Search pharmaceutical remedies
            if (remedies[condition].pharmaceutical) {
                remedies[condition].pharmaceutical.forEach(remedy => {
                    if (remedy.toLowerCase().includes(query.toLowerCase())) {
                        allRemedies.push({
                            type: 'pharmaceutical',
                            condition,
                            remedy: remedy,
                            image: 'images/medicine.jpg'
                        });
                    }
                });
            }
        }

        return allRemedies.slice(0, 10); // Limit to 10 results
    }

    function displayRemedyResults(results) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result">No remedy matches found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result remedy-result';
            
            const remedyText = typeof result.remedy === 'string' ? result.remedy : result.remedy.remedy;
            const benefits = typeof result.remedy === 'string' ? '' : 
                (result.remedy.benefits ? `<p>Benefits: ${result.remedy.benefits.join(', ')}</p>` : '');
            const preparation = typeof result.remedy === 'string' ? '' : 
                (result.remedy.preparation ? `<p>How to use: ${result.remedy.preparation}</p>` : '');

            resultElement.innerHTML = `
                <div class="remedy-card">
                    <img src="${result.image}" alt="${remedyText}" class="remedy-image">
                    <div class="remedy-details">
                        <h4>${remedyText}</h4>
                        <p class="condition">For: ${result.condition}</p>
                        ${benefits}
                        ${preparation}
                        <p class="type">Type: ${result.type}</p>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(resultElement);
        });

        resultsContainer.style.display = 'block';
    }

    function displayPageResults(results) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result">No results found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('a');
            resultElement.href = result.url;
            resultElement.className = 'search-result';
            resultElement.innerHTML = `
                <strong>${result.title}</strong>
                <p>${result.content.substring(0, 100)}...</p>
            `;
            resultsContainer.appendChild(resultElement);
        });

        resultsContainer.style.display = 'block';
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-bar')) {
            resultsContainer.style.display = 'none';
        }
    });

    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');

    // Example credentials (replace with your authentication logic)
    /**
     * An object representing valid user credentials.
     * @property {string} username - The username for authentication.
     * @property {string} password - The password for authentication.
     */
    const validCredentials = {
        username: 'admin',
        password: 'password123'
    };

    // Manual login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === validCredentials.username && password === validCredentials.password) {
            alert('Login successful!');
            loginContainer.style.display = 'none'; // Hide login form
        } else {
            loginError.style.display = 'block'; // Show error message
        }
    });

    // Google Sign-In callback
    window.handleGoogleSignIn = function (response) {
        const user = jwt_decode(response.credential);
        console.log('Google User:', user);
        alert(`Welcome, ${user.name}!`);
        loginContainer.style.display = 'none'; // Hide login form
    };

    if (character && userInput && askButton && chatArea) {
        // Conversation history
        let conversationHistory = [];
        const MAX_HISTORY = 5;

        // Character states and animations
        const characterStates = {
            idle: { animation: 'Idle', expression: 'neutral' },
            thinking: { animation: 'Thinking', expression: 'curious' },
            talking: { animation: 'Talking', expression: 'happy' },
            happy: { animation: 'Happy', expression: 'excited' },
            confused: { animation: 'Confused', expression: 'surprised' }
        };

        // Set character state with animation
        function setCharacterState(state) {
            const modelViewer = document.querySelector('model-viewer');
            if (!modelViewer) return;
            
            const stateConfig = characterStates[state] || characterStates.idle;
            
            // Set animation if available
            if (modelViewer.availableAnimations.includes(stateConfig.animation)) {
                modelViewer.animationName = stateConfig.animation;
            }
            
            // Set facial expression (if supported by model)
            if (modelViewer.setExpression) {
                modelViewer.setExpression(stateConfig.expression);
            }
        }

        // Ensure text box is focused on page load
        userInput.focus();

        // Input focus and typing effects
        userInput.addEventListener('focus', () => {
            setCharacterState('thinking');
            userInput.style.border = '2px solid #4CAF50';
        });
        
        userInput.addEventListener('blur', () => {
            setCharacterState('');
            userInput.style.border = '1px solid #ccc';
        });
        
        userInput.addEventListener('input', () => {
            setCharacterState(userInput.value.length > 0 ? 'talking' : 'thinking');
        });

        // Handle message sending
        askButton.addEventListener('click', () => {
            sendMessage();
            userInput.focus(); // Refocus after sending
        });
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
                userInput.focus(); // Refocus after sending
            }
        });

        function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            setCharacterState('happy');
            setTimeout(() => setCharacterState(''), 2000);

            // Add user message to chat and history
            appendMessage(chatArea, 'user-message', message);
            addToHistory('user', message);

            // Process and generate response
            setTimeout(() => {
                const response = generateResponse(message);
                appendMessage(chatArea, 'bot-message', response);
                addToHistory('bot', response);
                chatArea.scrollTop = chatArea.scrollHeight;
            }, 1000);

            userInput.value = '';
        }

        // Append message to chat
        function appendMessage(container, className, text) {
            const message = document.createElement('div');
            message.className = className;
            message.innerHTML = `<p>${text}</p>`;
            container.appendChild(message);
        }

        // Maintain conversation history
        function addToHistory(role, content) {
            conversationHistory.push({ role, content });
            if (conversationHistory.length > MAX_HISTORY) {
                conversationHistory.shift();
            }
        }

        // Enhanced response generation with ChatGPT fallback
        async function generateResponse(input) {
            // Handle greetings
            if (isGreeting(input)) {
                return getRandomResponse(commonQuestions.greeting);
            }

            // Handle thanks
            if (isThanks(input)) {
                return getRandomResponse(commonQuestions.thanks);
            }

            try {
                // Try ChatGPT API first
                const response = await fetchChatGPTResponse(input);
                if (response) return response;
            } catch (error) {
                console.error("ChatGPT API error:", error);
            }

            // Fallback to local knowledge base
            const keywords = extractKeywords(input);
            if (!keywords) {
                return getRandomResponse(commonQuestions.unknown);
            }

            const remedyCategories = Object.keys(remedies);
            const matchedCategory = findBestMatch(keywords[0], remedyCategories);
            
            if (!matchedCategory || !remedies[matchedCategory]) {
                return getRandomResponse(commonQuestions.unknown);
            }

            const category = remedies[matchedCategory];
            let response = `For ${matchedCategory}, here are some suggestions:\n\n`;
            
            response += "Natural Remedies:\n";
            response += category.natural.map(r => `• ${r}`).join('\n');
            
            response += "\n\nPharmaceutical Options:\n";
            response += category.pharmaceutical.map(r => `• ${r}`).join('\n');
            
            response += "\n\nRemember to consult a doctor for serious conditions.";

            return response;
        }

        // ChatGPT API integration
        async function fetchChatGPTResponse(input) {
            const API_KEY = window.config?.openai?.apiKey;
            if (!API_KEY || API_KEY === "YOUR_OPENAI_API_KEY") {
                console.warn("OpenAI API key not configured - using local knowledge base");
                return null;
            }
            const endpoint = "https://api.openai.com/v1/chat/completions";
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{
                            role: "system",
                            content: "You are a helpful health assistant specializing in natural and pharmaceutical remedies. Provide concise, professional advice."
                        }, {
                            role: "user",
                            content: input
                        }],
                        temperature: 0.7,
                        max_tokens: 150
                    })
                });

                const data = await response.json();
                return data.choices[0]?.message?.content || null;
            } catch (error) {
                console.error("ChatGPT API error:", error);
                return null;
            }
        }
    }
});

// Load seasonal health tip
function loadSeasonalTip() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    const currentMonth = new Date().getMonth();
    const seasonalTip = window.knowledgeBase.getSeasonalTips(currentMonth);
    const tipContainer = document.getElementById('seasonal-tip');
    const monthContainer = document.getElementById('seasonal-tip-month');
    const imageContainer = document.getElementById('seasonal-tip-img');
    
    if (!seasonalTip || !tipContainer || !monthContainer || !imageContainer) return;
    
    monthContainer.textContent = monthNames[currentMonth];
    imageContainer.src = `images/seasonal-${currentMonth + 1}.jpg`;
    imageContainer.alt = `${monthNames[currentMonth]} health tip`;
    
    tipContainer.innerHTML = `
        <div class="tip-text">
            <p>${seasonalTip.tip}</p>
            <div class="remedies">
                <h4>Recommended Remedies:</h4>
                <ul>
                    ${seasonalTip.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="actions">
            <h4>Recommended Actions:</h4>
            <ul class="tip-actions">
                ${seasonalTip.actions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
        <div class="research">
            <small>Research reference: ${seasonalTip.research}</small>
        </div>
    `;
}
