import express from 'express';
import pool from '../config/database.js';
import { calculateLevelProgress, calculateSkillScores } from '../services/scoringService.js';

const router = express.Router();

/**
 * GET /api/progress/:userId
 * Get user's overall progress
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user data
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Get progress data
    const progressResult = await pool.query('SELECT * FROM progress WHERE user_id = $1', [userId]);
    const progress = progressResult.rows[0] || {
      scenarios_completed: 0,
      average_score: 0,
      total_time_spent: 0,
      capstone_completed: false
    };

    // Get all user attempts
    const attemptsResult = await pool.query(
      'SELECT * FROM attempts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    const attempts = attemptsResult.rows;

    // Calculate skill scores for spider chart
    const skillScores = calculateSkillScores(attempts);

    // Calculate level progress
    const levelProgress = calculateLevelProgress(user.total_points);

    // Get module progress
    const moduleProgressResult = await pool.query(`
      SELECT
        s.module,
        COUNT(DISTINCT s.id) as total,
        COUNT(DISTINCT CASE WHEN a.score >= 70 THEN s.id END) as completed,
        COALESCE(AVG(CASE WHEN a.score >= 70 THEN a.score END), 0) as avg_score
      FROM scenarios s
      LEFT JOIN attempts a ON s.id = a.scenario_id AND a.user_id = $1 AND a.attempt_number = 1
      WHERE s.is_capstone = false
      GROUP BY s.module
      ORDER BY
        CASE s.module
          WHEN 'foundation' THEN 1
          WHEN 'intermediate' THEN 2
          WHEN 'advanced' THEN 3
          WHEN 'expert' THEN 4
        END
    `, [userId]);

    // Get recent activity (last 10 attempts)
    const recentActivityResult = await pool.query(`
      SELECT
        a.id,
        a.score,
        a.created_at,
        s.title as scenario_title,
        s.module
      FROM attempts a
      JOIN scenarios s ON a.scenario_id = s.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        total_points: user.total_points,
        current_level: user.current_level,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak
      },
      progress: {
        scenarios_completed: progress.scenarios_completed,
        total_scenarios: 50,
        average_score: Math.round(progress.average_score * 10) / 10,
        total_time_spent: progress.total_time_spent,
        capstone_completed: progress.capstone_completed,
        completion_percentage: Math.round((progress.scenarios_completed / 50) * 100)
      },
      level: levelProgress,
      skill_scores: skillScores,
      module_progress: moduleProgressResult.rows,
      recent_activity: recentActivityResult.rows
    });
  } catch (error) {
    console.error('❌ Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/progress/:userId/streak
 * Update user's daily streak
 */
router.post('/:userId/streak', async (req, res) => {
  const { userId } = req.params;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = user.last_activity_date;

    let newStreak = 1;

    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change
        return res.json({ success: true, streak: user.current_streak });
      } else if (diffDays === 1) {
        // Consecutive day, increment
        newStreak = user.current_streak + 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }

    const longestStreak = Math.max(user.longest_streak, newStreak);

    await pool.query(
      `UPDATE users
       SET current_streak = $1,
           longest_streak = $2,
           last_activity_date = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [newStreak, longestStreak, today, userId]
    );

    res.json({
      success: true,
      streak: newStreak,
      longest_streak: longestStreak
    });
  } catch (error) {
    console.error('❌ Error updating streak:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

export default router;
