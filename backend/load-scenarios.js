import pkg from 'pg';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function loadScenarios() {
  try {
    const scenarios = JSON.parse(readFileSync('data/scenarios-module1-foundation.json', 'utf-8'));
    
    for (const s of scenarios) {
      await pool.query(
        'INSERT INTO scenarios (module, title, description, business_context, task_description, learning_objectives, evaluation_criteria, ideal_answer, difficulty, estimated_time, order_index, is_capstone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [
          s.module,
          s.title,
          s.description,
          s.business_context,
          s.task_description,
          JSON.stringify(s.learning_objectives),
          JSON.stringify(s.evaluation_criteria),
          s.ideal_answer || null,
          s.difficulty,
          s.estimated_time || null,
          s.order_index,
          s.is_capstone
        ]
      );
    }
    
    console.log(`✅ Loaded ${scenarios.length} scenarios successfully`);
  } catch (error) {
    console.error('❌ Error loading scenarios:', error);
  } finally {
    await pool.end();
  }
}

loadScenarios();
