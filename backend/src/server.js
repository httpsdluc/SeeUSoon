const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentsRoutes = require('./routes/students');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');
const scheduleRoutes = require('./routes/schedule');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running! 🚀' });
});

app.use('/api/students', studentsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/schedule', scheduleRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
