const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback
router.get('/', async (req, res) => {
  try {
    // Note: In an actual app, you would verify if req.user is an admin
    const feedbacks = await Feedback.find().populate('project', 'name').sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/project/:projectId
router.get('/project/:projectId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ project: req.params.projectId });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
