const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// POST /api/notifications
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; 
    let filter = {};
    if (userId) filter.user = userId;
    
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
