require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const seedDatabase = require('./seeds/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '..', 'client')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dashboard.html'));
});

// Start server
const startServer = async () => {
  try {
    // Connect to in-memory MongoDB
    await connectDB();
    
    // Seed database with sample data on every startup
    await seedDatabase();

    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ═══════════════════════════════════════');
      console.log(`   Mini CRM Server running on port ${PORT}`);
      console.log(`   🌐 http://localhost:${PORT}`);
      console.log('   📧 Login: admin@minicrm.com / admin123');
      console.log('═══════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
