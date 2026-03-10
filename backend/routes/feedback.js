const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/feedback (auth required)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const feedbackData = {
      name: req.body.name,
      email: req.body.email,
      project: req.body.project || null,
      issueType: req.body.issueType,
      message: req.body.message,
      user: req.user.id,
    };
    if (req.file) {
      feedbackData.image = `/uploads/${req.file.filename}`;
    }
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback (admin)
router.get('/', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('project', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/project/:projectId
router.get('/project/:projectId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/feedback/:id/status (admin)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
