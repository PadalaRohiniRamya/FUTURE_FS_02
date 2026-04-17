const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/leads - List all leads with search/filter
router.get('/', async (req, res) => {
  try {
    const { search, status, source, sort } = req.query;
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by source
    if (source && source !== 'all') {
      query.source = source;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'status') sortOption = { status: 1 };

    const leads = await Lead.find(query).sort(sortOption);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/leads/stats - Analytics
router.get('/stats', async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const contacted = await Lead.countDocuments({ status: 'contacted' });
    const converted = await Lead.countDocuments({ status: 'converted' });

    const sourceStats = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email status createdAt');

    res.json({
      total,
      new: newLeads,
      contacted,
      converted,
      sourceStats,
      recentLeads
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/leads - Create new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;

    const lead = new Lead({ name, email, phone, source, status });
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, source, status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// POST /api/leads/:id/notes - Add follow-up note
router.post('/:id/notes', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes.push({ text });
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
