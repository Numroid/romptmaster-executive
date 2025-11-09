import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/scenarios
 * Get all scenarios (optionally filtered by module)
 */
router.get('/', async (req, res) => {
  const { module } = req.query;

  try {
    let query = 'SELECT * FROM scenarios WHERE is_capstone = false ORDER BY order_index';
    let params = [];

    if (module) {
      query = 'SELECT * FROM scenarios WHERE module = $1 AND is_capstone = false ORDER BY order_index';
      params = [module];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      scenarios: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

/**
 * GET /api/scenarios/:id
 * Get a specific scenario by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM scenarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    res.json({
      success: true,
      scenario: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

/**
 * GET /api/scenarios/capstone
 * Get the capstone project scenario
 */
router.get('/capstone/project', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scenarios WHERE is_capstone = true LIMIT 1');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Capstone project not found' });
    }

    res.json({
      success: true,
      scenario: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching capstone:', error);
    res.status(500).json({ error: 'Failed to fetch capstone project' });
  }
});

/**
 * GET /api/scenarios/modules/summary
 * Get summary of all modules
 */
router.get('/modules/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        module,
        COUNT(*) as total_scenarios,
        AVG(estimated_time) as avg_time
      FROM scenarios
      WHERE is_capstone = false
      GROUP BY module
      ORDER BY
        CASE module
          WHEN 'foundation' THEN 1
          WHEN 'intermediate' THEN 2
          WHEN 'advanced' THEN 3
          WHEN 'expert' THEN 4
        END
    `);

    res.json({
      success: true,
      modules: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching module summary:', error);
    res.status(500).json({ error: 'Failed to fetch module summary' });
  }
});

export default router;
