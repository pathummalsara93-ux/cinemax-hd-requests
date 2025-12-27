const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GitHub Config
const GITHUB_TOKEN = "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";
const OWNER = "pathummalsara93-ux";
const REPO = "Database-";
const FILE_PATH = "requests.json";
const BRANCH = "main";

// Get current requests.json content from GitHub
async function getRequests() {
  const res = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const content = Buffer.from(res.data.content, 'base64').toString();
  return { content: JSON.parse(content), sha: res.data.sha };
}

// Save updated requests.json to GitHub
async function saveRequests(requests, sha) {
  const contentEncoded = Buffer.from(JSON.stringify(requests, null, 2)).toString('base64');
  await axios.put(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    message: "New movie request",
    content: contentEncoded,
    sha: sha,
    branch: BRANCH
  }, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
}

// API endpoint to fetch requests
app.get('/api/requests', async (req, res) => {
  try {
    const { content } = await getRequests();
    res.json(content.reverse()); // latest first
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// API endpoint to add a new request
app.post('/api/addRequest', async (req, res) => {
  try {
    const { movieName, quality, subtitle } = req.body;
    if(!movieName) return res.status(400).json({ error: "Movie name required" });

    const { content, sha } = await getRequests();
    content.push({ movieName, quality, subtitle, timestamp: Date.now() });
    await saveRequests(content, sha);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save request" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
