import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/leaderboard/top
 * Get top performers (overall)
 */
router.get('/top', async (req, res) => {
  const { limit = 10 } = req.query;

  try {
    const result = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.picture,
        u.total_points,
        u.current_level,
        p.scenarios_completed,
        p.average_score
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id
       WHERE p.scenarios_completed > 0
       ORDER BY u.total_points DESC, p.average_score DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      leaderboard: result.rows.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user.id,
          name: user.name,
          picture: user.picture
        },
        stats: {
          total_points: user.total_points,
          level: user.current_level,
          scenarios_completed: user.scenarios_completed,
          average_score: Math.round(user.average_score * 10) / 10
        }
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/leaderboard/weekly
 * Get top performers this week
 */
router.get('/weekly', async (req, res) => {
  const { limit = 10 } = req.query;

  try {
    const result = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.picture,
        COUNT(a.id) as scenarios_this_week,
        AVG(a.score) as avg_score_this_week,
        SUM(
          CASE
            WHEN a.score >= 90 THEN 150
            WHEN a.score >= 80 THEN 125
            ELSE 100
          END
        ) as points_this_week
       FROM users u
       INNER JOIN attempts a ON u.id = a.user_id
       WHERE a.created_at >= CURRENT_DATE - INTERVAL '7 days'
         AND a.attempt_number = 1
       GROUP BY u.id, u.name, u.picture
       ORDER BY points_this_week DESC, avg_score_this_week DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      leaderboard: result.rows.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user.id,
          name: user.name,
          picture: user.picture
        },
        stats: {
          scenarios_this_week: user.scenarios_this_week,
          avg_score_this_week: Math.round(user.avg_score_this_week * 10) / 10,
          points_this_week: user.points_this_week
        }
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching weekly leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch weekly leaderboard' });
  }
});

/**
 * GET /api/leaderboard/user/:userId
 * Get user's rank and nearby competitors
 */
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all users ranked by points
    const allUsers = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.total_points,
        p.average_score
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id
       WHERE p.scenarios_completed > 0
       ORDER BY u.total_points DESC, p.average_score DESC`
    );

    const userIndex = allUsers.rows.findIndex(u => u.id == userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in rankings' });
    }

    const rank = userIndex + 1;
    const total = allUsers.rows.length;

    // Get 2 above and 2 below
    const start = Math.max(0, userIndex - 2);
    const end = Math.min(total, userIndex + 3);
    const nearby = allUsers.rows.slice(start, end);

    res.json({
      success: true,
      user_rank: rank,
      total_users: total,
      percentile: Math.round((1 - (rank / total)) * 100),
      nearby: nearby.map((user, index) => ({
        rank: start + index + 1,
        user: {
          id: user.id,
          name: user.name
        },
        stats: {
          total_points: user.total_points,
          average_score: Math.round(user.average_score * 10) / 10
        },
        is_current_user: user.id == userId
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching user rank:', error);
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
});

export default router;
