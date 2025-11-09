import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Evaluate a user's prompt using Claude Haiku 4.5 with prompt caching
 * @param {Object} scenario - The scenario object with context and criteria
 * @param {String} userPrompt - The user's submitted prompt
 * @returns {Object} Evaluation result with score, feedback, etc.
 */
export async function evaluatePrompt(scenario, userPrompt) {
  try {
    // Construct the evaluation prompt with caching
    const systemPrompt = buildEvaluationPrompt(scenario);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4.5-20250929',
      max_tokens: 2000,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' } // Enable prompt caching
        }
      ],
      messages: [
        {
          role: 'user',
          content: `Please evaluate this prompt:\n\n${userPrompt}`
        }
      ]
    });

    // Parse the response
    const evaluation = parseEvaluationResponse(response.content[0].text);

    // Log cache usage for monitoring
    if (response.usage) {
      console.log('📊 Cache stats:', {
        input_tokens: response.usage.input_tokens,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens || 0,
        cache_read_input_tokens: response.usage.cache_read_input_tokens || 0,
        output_tokens: response.usage.output_tokens
      });
    }

    return evaluation;
  } catch (error) {
    console.error('❌ Anthropic API error:', error);
    throw new Error('Failed to evaluate prompt: ' + error.message);
  }
}

/**
 * Build the evaluation prompt with scenario context and criteria
 */
function buildEvaluationPrompt(scenario) {
  const criteriaList = Object.entries(scenario.evaluation_criteria)
    .map(([key, criteria]) => {
      return `- ${key.toUpperCase()} (weight: ${criteria.weight}): ${criteria.description}`;
    })
    .join('\n');

  return `You are an expert prompt engineering instructor evaluating a business professional's prompt for a learning platform.

SCENARIO CONTEXT:
${scenario.business_context}

TASK DESCRIPTION:
${scenario.task_description}

LEARNING OBJECTIVES FOR THIS SCENARIO:
${scenario.learning_objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

DIFFICULTY LEVEL: ${scenario.difficulty}

EVALUATION CRITERIA:
${criteriaList}

INSTRUCTIONS:
Evaluate the user's prompt based on the criteria above. Provide constructive, encouraging feedback that helps them improve.

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "criteria_scores": {
    "clarity": <number 0-100>,
    "specificity": <number 0-100>,
    "context": <number 0-100>,
    "format": <number 0-100>
  },
  "strengths": [
    "First specific strength they demonstrated",
    "Second specific strength they demonstrated"
  ],
  "improvements": [
    "First specific, actionable improvement suggestion",
    "Second specific, actionable improvement suggestion"
  ],
  "rewrite_example": "An improved version of their prompt that demonstrates the suggestions",
  "key_takeaway": "One concise sentence summarizing the main lesson"
}

Keep feedback professional, specific, and actionable. Focus on business value. Be encouraging but honest.`;
}

/**
 * Parse Claude's evaluation response
 */
function parseEvaluationResponse(responseText) {
  try {
    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const evaluation = JSON.parse(jsonText);

    // Validate required fields
    const required = ['score', 'criteria_scores', 'strengths', 'improvements', 'rewrite_example', 'key_takeaway'];
    for (const field of required) {
      if (!evaluation[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure score is within bounds
    evaluation.score = Math.max(0, Math.min(100, evaluation.score));

    return evaluation;
  } catch (error) {
    console.error('❌ Failed to parse evaluation:', error);
    console.error('Response text:', responseText);

    // Return fallback evaluation
    return {
      score: 50,
      criteria_scores: { clarity: 50, specificity: 50, context: 50, format: 50 },
      strengths: ['You submitted a prompt - great start!'],
      improvements: ['Try to be more specific about what you want the AI to do.'],
      rewrite_example: 'Unable to generate rewrite at this time.',
      key_takeaway: 'Keep practicing and refining your prompts.',
      error: 'Evaluation parsing failed'
    };
  }
}

export default {
  evaluatePrompt
};
