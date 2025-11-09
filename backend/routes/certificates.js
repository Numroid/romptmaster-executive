import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/certificates/eligibility/:userId
 * Check if user is eligible for certification
 */
router.get('/eligibility/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user progress
    const progressResult = await pool.query('SELECT * FROM progress WHERE user_id = $1', [userId]);
    if (progressResult.rows.length === 0) {
      return res.json({
        eligible: false,
        reason: 'No progress found',
        requirements: {
          scenarios_completed: { current: 0, required: 50, met: false },
          average_score: { current: 0, required: 70, met: false },
          capstone_completed: { current: false, required: true, met: false }
        }
      });
    }

    const progress = progressResult.rows[0];

    const requirements = {
      scenarios_completed: {
        current: progress.scenarios_completed,
        required: 50,
        met: progress.scenarios_completed >= 50
      },
      average_score: {
        current: Math.round(progress.average_score * 10) / 10,
        required: 70,
        met: progress.average_score >= 70
      },
      capstone_completed: {
        current: progress.capstone_completed,
        required: true,
        met: progress.capstone_completed
      }
    };

    const eligible = Object.values(requirements).every(req => req.met);

    res.json({
      success: true,
      eligible,
      requirements,
      message: eligible
        ? 'Congratulations! You are eligible for certification.'
        : 'Complete all requirements to earn your certificate.'
    });
  } catch (error) {
    console.error('❌ Error checking eligibility:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

/**
 * POST /api/certificates/generate
 * Generate certificate for eligible user
 */
router.post('/generate', async (req, res) => {
  const { userId, fullName } = req.body;

  if (!userId || !fullName) {
    return res.status(400).json({ error: 'userId and fullName required' });
  }

  try {
    // Check eligibility first
    const progressResult = await pool.query('SELECT * FROM progress WHERE user_id = $1', [userId]);
    if (progressResult.rows.length === 0) {
      return res.status(400).json({ error: 'No progress found' });
    }

    const progress = progressResult.rows[0];

    if (progress.scenarios_completed < 50 || progress.average_score < 70 || !progress.capstone_completed) {
      return res.status(400).json({ error: 'User not eligible for certification' });
    }

    // Check if certificate already exists
    const existingCert = await pool.query('SELECT * FROM certificates WHERE user_id = $1', [userId]);
    if (existingCert.rows.length > 0) {
      return res.json({
        success: true,
        message: 'Certificate already issued',
        certificate: existingCert.rows[0]
      });
    }

    // Generate unique certificate ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const certificateId = `PM-${year}-${randomNum}`;

    // Insert certificate record
    const result = await pool.query(
      `INSERT INTO certificates
       (user_id, certificate_id, full_name, overall_score, issue_date, verification_url)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, $5)
       RETURNING *`,
      [
        userId,
        certificateId,
        fullName,
        progress.average_score,
        `https://promptmaster.com/verify/${certificateId}`
      ]
    );

    // TODO: Generate PDF and LinkedIn badge (Phase 4)
    // For now, just return the certificate record

    res.json({
      success: true,
      message: 'Certificate generated successfully',
      certificate: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error generating certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

/**
 * GET /api/certificates/verify/:certificateId
 * Verify a certificate by ID (public endpoint)
 */
router.get('/verify/:certificateId', async (req, res) => {
  const { certificateId } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        c.certificate_id,
        c.full_name,
        c.overall_score,
        c.issue_date,
        c.is_public
       FROM certificates c
       WHERE c.certificate_id = $1`,
      [certificateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const cert = result.rows[0];

    if (!cert.is_public) {
      return res.status(403).json({ error: 'Certificate is private' });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        id: cert.certificate_id,
        name: cert.full_name,
        score: Math.round(cert.overall_score * 10) / 10,
        issue_date: cert.issue_date
      }
    });
  } catch (error) {
    console.error('❌ Error verifying certificate:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

/**
 * GET /api/certificates/:userId
 * Get user's certificate
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM certificates WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No certificate found' });
    }

    res.json({
      success: true,
      certificate: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

export default router;
