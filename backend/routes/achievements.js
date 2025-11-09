import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/achievements/:userId
 * Get all achievements for a user
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM achievements WHERE user_id = $1 ORDER BY earned_at DESC',
      [userId]
    );

    // Define all possible badges
    const allBadges = [
      { type: 'first_steps', name: 'First Steps', description: 'Completed your first scenario', icon: '🎯' },
      { type: 'week_warrior', name: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: '🔥' },
      { type: 'quality_master', name: 'Quality Master', description: 'Scored 90% or higher on 10 scenarios', icon: '💎' },
      { type: 'speed_demon', name: 'Speed Demon', description: 'Completed 5 scenarios in one session', icon: '🚀' },
      { type: 'module_champion', name: 'Module Champion', description: 'Completed an entire module', icon: '📚' },
      { type: 'perfectionist', name: 'Prompt Perfectionist', description: 'Achieved a perfect 100% score', icon: '🏆' },
      { type: 'lightning_round', name: 'Lightning Round', description: 'Completed a scenario in under 5 minutes', icon: '⚡' },
      { type: 'graduate', name: 'Graduate', description: 'Completed all 50 scenarios', icon: '🎓' },
      { type: 'innovator', name: 'Innovator', description: 'Created a custom prompt template', icon: '💡' },
      { type: 'promptmaster', name: 'PromptMaster', description: 'Achieved 90%+ average score', icon: '👑' }
    ];

    const earned = result.rows.map(a => ({
      ...a,
      icon: allBadges.find(b => b.type === a.badge_type)?.icon || '🏅'
    }));

    const earnedTypes = new Set(earned.map(a => a.badge_type));
    const locked = allBadges.filter(b => !earnedTypes.has(b.type));

    res.json({
      success: true,
      earned: earned,
      locked: locked,
      total_earned: earned.length,
      total_possible: allBadges.length
    });
  } catch (error) {
    console.error('❌ Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;
