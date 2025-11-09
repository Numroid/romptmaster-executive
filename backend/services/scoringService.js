/**
 * Calculate points earned for a scenario completion
 * @param {Number} score - Score out of 100
 * @param {Number} timeSpent - Time in seconds
 * @param {Number} suggestedTime - Suggested time in minutes
 * @param {Number} currentStreak - User's current streak
 * @returns {Object} Points breakdown
 */
export function calculatePoints(score, timeSpent, suggestedTime, currentStreak = 0) {
  let points = 0;
  const breakdown = {};

  // Base points for completion
  breakdown.base = 100;
  points += breakdown.base;

  // Quality bonus (based on score)
  if (score >= 90) {
    breakdown.quality = 50;
    points += 50;
  } else if (score >= 80) {
    breakdown.quality = 25;
    points += 25;
  } else {
    breakdown.quality = 0;
  }

  // Speed bonus (if completed within suggested time)
  const timeSpentMinutes = timeSpent / 60;
  if (suggestedTime && timeSpentMinutes <= suggestedTime) {
    breakdown.speed = 25;
    points += 25;
  } else {
    breakdown.speed = 0;
  }

  // Streak bonus (10 points per consecutive day, max 70)
  const streakBonus = Math.min(currentStreak * 10, 70);
  breakdown.streak = streakBonus;
  points += streakBonus;

  return {
    total: points,
    breakdown
  };
}

/**
 * Calculate user level based on total points
 * @param {Number} totalPoints - User's total accumulated points
 * @returns {Number} Current level (1-20)
 */
export function calculateLevel(totalPoints) {
  // Each level requires 500 points
  return Math.min(Math.floor(totalPoints / 500) + 1, 20);
}

/**
 * Calculate progress to next level
 * @param {Number} totalPoints - User's total points
 * @returns {Object} Progress information
 */
export function calculateLevelProgress(totalPoints) {
  const currentLevel = calculateLevel(totalPoints);
  const pointsForCurrentLevel = (currentLevel - 1) * 500;
  const pointsForNextLevel = currentLevel * 500;
  const pointsInCurrentLevel = totalPoints - pointsForCurrentLevel;
  const pointsNeededForNext = pointsForNextLevel - totalPoints;
  const progressPercentage = (pointsInCurrentLevel / 500) * 100;

  return {
    currentLevel,
    pointsInCurrentLevel,
    pointsNeededForNext,
    progressPercentage: Math.round(progressPercentage),
    nextLevel: currentLevel < 20 ? currentLevel + 1 : 20
  };
}

/**
 * Calculate skill scores for spider chart
 * @param {Array} attempts - User's attempts
 * @returns {Object} Skill scores (6 dimensions)
 */
export function calculateSkillScores(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      clarity: 0,
      context: 0,
      advanced_techniques: 0,
      business_application: 0,
      output_quality: 0,
      innovation: 0
    };
  }

  // Group attempts by criteria and calculate averages
  const criteriaScores = {};
  attempts.forEach(attempt => {
    if (attempt.criteria_scores) {
      Object.entries(attempt.criteria_scores).forEach(([key, value]) => {
        if (!criteriaScores[key]) {
          criteriaScores[key] = [];
        }
        criteriaScores[key].push(value);
      });
    }
  });

  // Calculate averages
  const avgScores = {};
  Object.entries(criteriaScores).forEach(([key, values]) => {
    avgScores[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  });

  // Map to spider chart dimensions
  return {
    clarity: avgScores.clarity || 0,
    context: avgScores.context || 0,
    advanced_techniques: avgScores.advanced_techniques || avgScores.reasoning || 0,
    business_application: avgScores.business_value || avgScores.impact || 0,
    output_quality: avgScores.format || avgScores.specificity || 0,
    innovation: avgScores.innovation || avgScores.creativity || 0
  };
}

/**
 * Check if user has earned any new achievements
 * @param {Object} user - User object
 * @param {Object} progress - User progress object
 * @param {Array} attempts - User attempts
 * @param {Array} existingAchievements - Already earned achievements
 * @returns {Array} New achievements earned
 */
export function checkAchievements(user, progress, attempts, existingAchievements = []) {
  const newAchievements = [];
  const earned = new Set(existingAchievements.map(a => a.badge_type));

  // 1. First Steps - Complete scenario 1
  if (progress.scenarios_completed >= 1 && !earned.has('first_steps')) {
    newAchievements.push({
      badge_type: 'first_steps',
      badge_name: 'First Steps',
      badge_description: 'Completed your first scenario',
      icon: '🎯'
    });
  }

  // 2. Week Warrior - 7-day streak
  if (user.current_streak >= 7 && !earned.has('week_warrior')) {
    newAchievements.push({
      badge_type: 'week_warrior',
      badge_name: 'Week Warrior',
      badge_description: 'Maintained a 7-day learning streak',
      icon: '🔥'
    });
  }

  // 3. Quality Master - 10 scenarios with 90%+
  const highScoreCount = attempts.filter(a => a.score >= 90).length;
  if (highScoreCount >= 10 && !earned.has('quality_master')) {
    newAchievements.push({
      badge_type: 'quality_master',
      badge_name: 'Quality Master',
      badge_description: 'Scored 90% or higher on 10 scenarios',
      icon: '💎'
    });
  }

  // 4. Speed Demon - 5 scenarios in one session (within 2 hours)
  // This would require session tracking - placeholder for now
  if (!earned.has('speed_demon')) {
    const recentAttempts = attempts.filter(a => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      return new Date(a.created_at) > twoHoursAgo;
    });
    if (recentAttempts.length >= 5) {
      newAchievements.push({
        badge_type: 'speed_demon',
        badge_name: 'Speed Demon',
        badge_description: 'Completed 5 scenarios in one session',
        icon: '🚀'
      });
    }
  }

  // 5. Module Champion - Complete any full module
  if (!earned.has('module_champion') && progress.module_progress) {
    const moduleCompletion = Object.values(progress.module_progress);
    if (moduleCompletion.some(m => m.completed === m.total && m.total > 0)) {
      newAchievements.push({
        badge_type: 'module_champion',
        badge_name: 'Module Champion',
        badge_description: 'Completed an entire module',
        icon: '📚'
      });
    }
  }

  // 6. Perfectionist - Score 100% on any scenario
  if (attempts.some(a => a.score === 100) && !earned.has('perfectionist')) {
    newAchievements.push({
      badge_type: 'perfectionist',
      badge_name: 'Prompt Perfectionist',
      badge_description: 'Achieved a perfect 100% score',
      icon: '🏆'
    });
  }

  // 7. Lightning Round - Complete scenario in under 5 minutes
  if (attempts.some(a => a.time_spent < 300) && !earned.has('lightning_round')) {
    newAchievements.push({
      badge_type: 'lightning_round',
      badge_name: 'Lightning Round',
      badge_description: 'Completed a scenario in under 5 minutes',
      icon: '⚡'
    });
  }

  // 8. Graduate - Complete all 50 scenarios
  if (progress.scenarios_completed >= 50 && !earned.has('graduate')) {
    newAchievements.push({
      badge_type: 'graduate',
      badge_name: 'Graduate',
      badge_description: 'Completed all 50 scenarios',
      icon: '🎓'
    });
  }

  // 9. PromptMaster - 90%+ average across all scenarios
  if (progress.average_score >= 90 && progress.scenarios_completed >= 10 && !earned.has('promptmaster')) {
    newAchievements.push({
      badge_type: 'promptmaster',
      badge_name: 'PromptMaster',
      badge_description: 'Achieved 90%+ average score',
      icon: '👑'
    });
  }

  return newAchievements;
}

export default {
  calculatePoints,
  calculateLevel,
  calculateLevelProgress,
  calculateSkillScores,
  checkAchievements
};
