import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import evaluationRoutes from './routes/evaluation.js';
import progressRoutes from './routes/progress.js';
import scenarioRoutes from './routes/scenarios.js';
import achievementRoutes from './routes/achievements.js';
import certificateRoutes from './routes/certificates.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/evaluate', evaluationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 PromptMaster Backend running on localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
