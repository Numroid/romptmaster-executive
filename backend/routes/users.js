import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * POST /api/users/sync
 * Sync user from Auth0 to database
 * Creates new user if doesn't exist, or returns existing user
 */
router.post('/sync', async (req, res) => {
  const { auth0_id, email, name, picture } = req.body;

  if (!auth0_id || !email) {
    return res.status(400).json({ error: 'auth0_id and email are required' });
  }

  try {
    // Check if user exists
    let userResult = await pool.query(
      'SELECT * FROM users WHERE auth0_id = $1',
      [auth0_id]
    );

    let user;

    if (userResult.rows.length > 0) {
      // User exists, update their info
      user = userResult.rows[0];

      // Update user info if changed
      await pool.query(
        `UPDATE users
         SET email = $1, name = $2, picture = $3, updated_at = CURRENT_TIMESTAMP
         WHERE auth0_id = $4`,
        [email, name || user.name, picture || user.picture, auth0_id]
      );

      // Get updated user
      userResult = await pool.query(
        'SELECT * FROM users WHERE auth0_id = $1',
        [auth0_id]
      );
      user = userResult.rows[0];
    } else {
      // Create new user
      userResult = await pool.query(
        `INSERT INTO users (auth0_id, email, name, picture, total_points, current_level)
         VALUES ($1, $2, $3, $4, 0, 1)
         RETURNING *`,
        [auth0_id, email, name, picture]
      );
      user = userResult.rows[0];

      // Initialize progress record
      await pool.query(
        'INSERT INTO progress (user_id) VALUES ($1)',
        [user.id]
      );
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        auth0_id: user.auth0_id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        total_points: user.total_points,
        current_level: user.current_level,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak
      }
    });
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

/**
 * GET /api/users/by-auth0/:auth0Id
 * Get user by Auth0 ID
 */
router.get('/by-auth0/:auth0Id', async (req, res) => {
  const { auth0Id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE auth0_id = $1',
      [auth0Id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        auth0_id: user.auth0_id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        total_points: user.total_points,
        current_level: user.current_level,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
