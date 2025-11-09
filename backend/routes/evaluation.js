import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { evaluatePrompt } from '../services/anthropicService.js';
import { calculatePoints, calculateLevel, checkAchievements } from '../services/scoringService.js';

const router = express.Router();

/**
 * POST /api/evaluate
 * Submit and evaluate a user's prompt
 */
router.post(
  '/',
  [
    body('userId').isInt().withMessage('Valid user ID required'),
    body('scenarioId').isInt().withMessage('Valid scenario ID required'),
    body('userPrompt').trim().isLength({ min: 20 }).withMessage('Prompt must be at least 20 characters'),
    body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be positive integer')
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, scenarioId, userPrompt, timeSpent = 0 } = req.body;

    try {
      // Get scenario details
      const scenarioResult = await pool.query(
        'SELECT * FROM scenarios WHERE id = $1',
        [scenarioId]
      );

      if (scenarioResult.rows.length === 0) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      const scenario = scenarioResult.rows[0];

      // Get user details
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.rows[0];

      // Count previous attempts for this scenario
      const attemptCountResult = await pool.query(
        'SELECT COUNT(*) as count FROM attempts WHERE user_id = $1 AND scenario_id = $2',
        [userId, scenarioId]
      );
      const attemptNumber = parseInt(attemptCountResult.rows[0].count) + 1;

      // Evaluate the prompt using Claude
      console.log(`🤖 Evaluating prompt for user ${userId}, scenario ${scenarioId}, attempt ${attemptNumber}...`);
      const evaluation = await evaluatePrompt(scenario, userPrompt);

      // Calculate points earned
      const pointsEarned = calculatePoints(
        evaluation.score,
        timeSpent,
        scenario.estimated_time,
        user.current_streak
      );

      // Store attempt in database
      const attemptResult = await pool.query(
        `INSERT INTO attempts
        (user_id, scenario_id, user_prompt, score, criteria_scores, strengths, improvements,
         rewrite_example, key_takeaway, time_spent, attempt_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          userId,
          scenarioId,
          userPrompt,
          evaluation.score,
          JSON.stringify(evaluation.criteria_scores),
          JSON.stringify(evaluation.strengths),
          JSON.stringify(evaluation.improvements),
          evaluation.rewrite_example,
          evaluation.key_takeaway,
          timeSpent,
          attemptNumber
        ]
      );

      const attempt = attemptResult.rows[0];

      // Check if this is the first successful completion (score >= 70)
      const isFirstCompletion = attemptNumber === 1 && evaluation.score >= 70;

      let newAchievements = [];
      let updatedUser = user;

      if (isFirstCompletion) {
        // Update user points and level
        const newTotalPoints = user.total_points + pointsEarned.total;
        const newLevel = calculateLevel(newTotalPoints);

        await pool.query(
          'UPDATE users SET total_points = $1, current_level = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [newTotalPoints, newLevel, userId]
        );

        // Update progress
        await pool.query(
          `INSERT INTO progress (user_id, scenarios_completed, total_time_spent)
           VALUES ($1, 1, $2)
           ON CONFLICT (user_id)
           DO UPDATE SET
             scenarios_completed = progress.scenarios_completed + 1,
             total_time_spent = progress.total_time_spent + $2,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, timeSpent]
        );

        // Get updated user data
        const updatedUserResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        updatedUser = updatedUserResult.rows[0];

        // Get updated progress
        const progressResult = await pool.query('SELECT * FROM progress WHERE user_id = $1', [userId]);
        const progress = progressResult.rows[0];

        // Get all user attempts for achievement checking
        const attemptsResult = await pool.query(
          'SELECT * FROM attempts WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        const allAttempts = attemptsResult.rows;

        // Get existing achievements
        const achievementsResult = await pool.query(
          'SELECT * FROM achievements WHERE user_id = $1',
          [userId]
        );
        const existingAchievements = achievementsResult.rows;

        // Check for new achievements
        newAchievements = checkAchievements(updatedUser, progress, allAttempts, existingAchievements);

        // Store new achievements
        for (const achievement of newAchievements) {
          await pool.query(
            'INSERT INTO achievements (user_id, badge_type, badge_name, badge_description) VALUES ($1, $2, $3, $4)',
            [userId, achievement.badge_type, achievement.badge_name, achievement.badge_description]
          );
        }
      }

      // Return evaluation results
      res.json({
        success: true,
        attempt: {
          id: attempt.id,
          score: evaluation.score,
          criteria_scores: evaluation.criteria_scores,
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
          rewrite_example: evaluation.rewrite_example,
          key_takeaway: evaluation.key_takeaway,
          attempt_number: attemptNumber,
          is_first_completion: isFirstCompletion
        },
        points: isFirstCompletion ? pointsEarned : null,
        newLevel: isFirstCompletion ? updatedUser.current_level : null,
        newAchievements: isFirstCompletion ? newAchievements : []
      });

    } catch (error) {
      console.error('❌ Evaluation error:', error);
      res.status(500).json({
        error: 'Failed to evaluate prompt',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/evaluate/history/:userId/:scenarioId
 * Get evaluation history for a specific scenario
 */
router.get('/history/:userId/:scenarioId', async (req, res) => {
  const { userId, scenarioId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, score, criteria_scores, strengths, improvements,
              rewrite_example, key_takeaway, time_spent, attempt_number, created_at
       FROM attempts
       WHERE user_id = $1 AND scenario_id = $2
       ORDER BY created_at DESC`,
      [userId, scenarioId]
    );

    res.json({
      success: true,
      attempts: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch evaluation history' });
  }
});

export default router;
