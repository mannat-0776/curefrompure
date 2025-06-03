// Import config for API keys


const OpenAI = require("openai");
const config = require('./config').default;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup OpenAI client
const openai = new OpenAI({
    apiKey: config.openai.apiKey,
});

// Regular expression to validate API key format (example: alphanumeric, 32-64 chars)
function validateApiKey(apiKey) {
    const apiKeyRegex = /^[a-zA-Z0-9-_]{32,64}$/;
    return apiKeyRegex.test(apiKey);
}

// Middleware to check symptom checker API key in requests
app.use('/api/symptom-checker', (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (!apiKey) {
        return res.status(401).json({ message: 'API key required' });
    }
    if (!validateApiKey(apiKey)) {
        return res.status(403).json({ message: 'Invalid API key format' });
    }
    if (apiKey !== config.symptomChecker.apiKey) {
        return res.status(403).json({ message: 'Unauthorized API key' });
    }
    next();
});

// Example symptom checker endpoint
app.post('/api/symptom-checker/check', async (req, res) => {
    // Here you would add the logic to handle symptom checking using the API key
    // For now, just return a success message
    res.json({ message: 'Symptom checker API key validated and request processed' });
});

// ChatGPT API endpoint
app.post('/api/chatgpt', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        res.json({ response: completion.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        res.status(500).json({ error: 'Failed to get response from ChatGPT' });
    }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/healthremedies', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, fullname } = req.body;
    if (!username || !password || !fullname) {
        return res.status(400).json({ message: 'All fields required' });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'Username already exists' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, fullname });
        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', user: { username: user.username, fullname: user.fullname, email: user.email } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Profile endpoint
app.get('/api/profile/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ username: user.username, fullname: user.fullname, email: user.email });
});

const fs = require('fs');
const path = require('path');

// Define Page schema and model
const pageSchema = new mongoose.Schema({
    filename: { type: String, unique: true, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

// Endpoint to save all HTML pages into MongoDB
app.post('/api/save-pages', async (req, res) => {
    try {
        const pagesDir = path.resolve(__dirname);
        const htmlFiles = [];

        // Recursively find all .html files in the project directory
        function findHtmlFiles(dir) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    findHtmlFiles(fullPath);
                } else if (file.endsWith('.html')) {
                    htmlFiles.push(fullPath);
                }
            }
        }
        findHtmlFiles(pagesDir);

        // Save each HTML file content to MongoDB
        for (const filePath of htmlFiles) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const relativePath = path.relative(pagesDir, filePath);
            await Page.findOneAndUpdate(
                { filename: relativePath },
                { content },
                { upsert: true, new: true }
            );
        }

        res.json({ message: `Saved ${htmlFiles.length} pages successfully.` });
    } catch (error) {
        console.error('Error saving pages:', error);
        res.status(500).json({ error: 'Failed to save pages' });
    }
});

// Endpoint to get all saved pages from MongoDB
app.get('/api/pages', async (req, res) => {
    try {
        const pages = await Page.find({});
        res.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
