const fetch = require('node-fetch');

window.testChatGptApi = async function (message) {
  try {
    const response = await fetch('http://localhost:3000/api/chatgpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message }),
    });
    const data = await response.json();
    console.log('ChatGPT API response:', data);
    return data;
  } catch (error) {
    console.error('Error testing ChatGPT API:', error);
    return { error: 'Error testing ChatGPT API' };
  }
};
