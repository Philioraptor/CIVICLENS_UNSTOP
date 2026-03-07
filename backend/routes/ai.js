const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/ai/summarize
router.post('/summarize', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Since the API key might be missing or mocked, we will handle a simulated response
    // if the real Hugging Face Inference API call fails or if the key is 'mock-api-key'
    
    const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
    const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    let summaryText = "";

    if (HF_API_KEY && HF_API_KEY !== 'mock-api-key') {
      try {
        const response = await axios.post(
          API_URL,
          { inputs: description },
          { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );
        summaryText = response.data[0]?.summary_text || "Unable to generate summary.";
      } catch (err) {
        console.error('Hugging Face API Error:', err.message);
        summaryText = `[Simulated Summary] ${description.substring(0, 100)}... This project will have significant community impact by improving local infrastructure and connectivity.`;
      }
    } else {
      // Mocked AI Response
      summaryText = `[Simulated AI Summary] This project involves creating necessary infrastructure. It has a well-defined budget and timeline, and expects to enhance the quality of life for nearby residents by improving daily civic operations.`;
    }

    res.json({ summary: summaryText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
