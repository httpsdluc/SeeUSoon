const express = require('express');
const cors = require('cors');
const studentsRoutes = require('./routes/students');
const matchesRoutes = require('./routes/matches');
const messagesRoutes = require('./routes/messages');
const scheduleRoutes = require('./routes/schedule');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow your frontend
app.use(cors({
  origin: [
    'https://see-u-soon-eight.vercel.app',
    'https://see-u-soon-csqk254jk-diana-luceros-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/students', studentsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SeeUSoon API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
