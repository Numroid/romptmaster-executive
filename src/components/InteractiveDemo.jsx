import React, { useState } from 'react'

const InteractiveDemo = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [userPrompt, setUserPrompt] = useState('')
  const [showResponse, setShowResponse] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Sample business context for budget analysis demo
  const businessContext = {
    title: "Q3 Budget Variance Analysis",
    scenario: "You're preparing for tomorrow's executive meeting where you need to explain significant budget variances.",
    data: {
      budgetedRevenue: "$2.4M",
      actualRevenue: "$2.1M", 
      variance: "-$300K (-12.5%)",
      keyFactors: [
        "Product launch delayed by 6 weeks",
        "Major client contract renegotiated", 
        "Market conditions softer than expected"
      ]
    },
    objective: "Create a prompt that will help you generate a clear, executive-level explanation of the variance and recommended actions."
  }

  const samplePrompts = [
    "Analyze the budget variance",
    "Help me understand why we're behind budget and what to do about it",
    "Create an executive summary explaining our Q3 revenue variance of -$300K (-12.5%) from budgeted $2.4M to actual $2.1M. Include key contributing factors: 6-week product launch delay, major client contract renegotiation, and softer market conditions. Provide 3 specific recommendations for Q4 recovery with timeline and expected impact."
  ]

  const aiResponse = `**Q3 Revenue Variance Executive Summary**

**Variance Overview:**
- Budgeted: $2.4M | Actual: $2.1M | Variance: -$300K (-12.5%)

**Root Cause Analysis:**
1. **Product Launch Delay (40% of variance):** 6-week delay reduced Q3 revenue by ~$120K
2. **Contract Renegotiation (35% of variance):** Major client terms resulted in ~$105K reduction  
3. **Market Softness (25% of variance):** Broader market conditions impacted ~$75K

**Q4 Recovery Recommendations:**
1. **Accelerate Product Launch** (Timeline: Oct 15)
   - Expected Impact: +$200K Q4 revenue
   - Action: Reallocate engineering resources, fast-track testing

2. **Client Retention Campaign** (Timeline: Nov 1)  
   - Expected Impact: +$150K Q4, +$300K Q1
   - Action: Executive relationship meetings, value demonstration

3. **Market Positioning Adjustment** (Timeline: Oct 30)
   - Expected Impact: +$100K Q4
   - Action: Pricing strategy review, competitive analysis

**Bottom Line:** With these actions, we project Q4 revenue of $2.6M, putting us back on track for annual targets.`

  const handlePromptSubmit = () => {
    if (userPrompt.trim()) {
      setShowResponse(true)
      setTimeout(() => setShowFeedback(true), 2000)
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const getPromptQuality = () => {
    const prompt = userPrompt.toLowerCase()
    if (prompt.includes('executive') && prompt.includes('variance') && prompt.includes('recommend')) {
      return { score: 95, feedback: "Excellent! Your prompt is specific, business-focused, and asks for actionable recommendations." }
    } else if (prompt.includes('variance') && prompt.includes('budget')) {
      return { score: 75, feedback: "Good start! Try being more specific about the audience (executives) and desired output format." }
    } else {
      return { score: 45, feedback: "Your prompt needs more business context. Include specific numbers, audience, and desired outcomes." }
    }
  }

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h2>Interactive Demo: Budget Analysis</h2>
        <p>Let's see how prompt engineering can transform your business communications</p>
        <div className="demo-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <span>Step {currentStep} of 4</span>
        </div>
      </div>

      <div className="demo-content">
        {currentStep === 1 && (
          <div className="step-content">
            <h3>The Business Challenge</h3>
            <div className="business-context">
              <div className="context-header">
                <h4>{businessContext.title}</h4>
                <p>{businessContext.scenario}</p>
              </div>
              
              <div className="context-data">
                <div className="data-row">
                  <span className="label">Budgeted Revenue:</span>
                  <span className="value">{businessContext.data.budgetedRevenue}</span>
                </div>
                <div className="data-row">
                  <span className="label">Actual Revenue:</span>
                  <span className="value">{businessContext.data.actualRevenue}</span>
                </div>
                <div className="data-row variance">
                  <span className="label">Variance:</span>
                  <span className="value negative">{businessContext.data.variance}</span>
                </div>
              </div>

              <div className="key-factors">
                <h5>Key Contributing Factors:</h5>
                <ul>
                  {businessContext.data.keyFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="step-action">
              <p><strong>Your Task:</strong> {businessContext.objective}</p>
              <button className="btn btn-primary" onClick={handleNext}>
                Let's Start →
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h3>Compare These Approaches</h3>
            <p>Here are three different ways someone might approach this task:</p>
            
            <div className="prompt-examples">
              <div className="prompt-example poor">
                <div className="example-header">
                  <span className="quality-badge poor">❌ Vague</span>
                  <span className="score">Score: 20/100</span>
                </div>
                <div className="prompt-text">"{samplePrompts[0]}"</div>
                <div className="example-feedback">
                  Too generic - AI won't know the context, audience, or desired format
                </div>
              </div>

              <div className="prompt-example okay">
                <div className="example-header">
                  <span className="quality-badge okay">⚠️ Better</span>
                  <span className="score">Score: 60/100</span>
                </div>
                <div className="prompt-text">"{samplePrompts[1]}"</div>
                <div className="example-feedback">
                  More context, but still lacks specificity about format and audience
                </div>
              </div>

              <div className="prompt-example excellent">
                <div className="example-header">
                  <span className="quality-badge excellent">✅ Excellent</span>
                  <span className="score">Score: 95/100</span>
                </div>
                <div className="prompt-text">"{samplePrompts[2]}"</div>
                <div className="example-feedback">
                  Specific context, clear audience, desired format, and actionable outcomes
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleNext}>
              Now You Try →
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <h3>Your Turn: Write the Prompt</h3>
            <p>Using the business context above, write a prompt that will generate a clear executive summary:</p>
            
            <div className="prompt-input-section">
              <div className="business-context-reminder">
                <h5>Quick Reminder:</h5>
                <p>Revenue variance: -$300K (-12.5%) due to product delay, contract renegotiation, and market conditions</p>
              </div>

              <div className="prompt-input">
                <label>Your Prompt:</label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Write your prompt here... Think about: Who is your audience? What specific information do you need? What format do you want?"
                  rows={6}
                />
                <div className="character-count">
                  {userPrompt.length} characters
                </div>
              </div>

              <div className="prompt-hints">
                <h5>💡 Hints for a great prompt:</h5>
                <ul>
                  <li>Specify your audience (executives, board, team)</li>
                  <li>Include the specific numbers and context</li>
                  <li>Ask for actionable recommendations</li>
                  <li>Request a specific format (summary, bullet points, etc.)</li>
                </ul>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handlePromptSubmit}
                disabled={!userPrompt.trim()}
              >
                Generate AI Response
              </button>
            </div>

            {showResponse && (
              <div className="ai-response-section">
                <h4>AI Response:</h4>
                <div className="ai-response">
                  <div className="response-content">
                    {aiResponse.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>

                {showFeedback && (
                  <div className="feedback-section">
                    <div className="feedback-score">
                      <span className="score-number">{getPromptQuality().score}/100</span>
                      <span className="score-label">Prompt Quality Score</span>
                    </div>
                    <div className="feedback-text">
                      {getPromptQuality().feedback}
                    </div>
                    <button className="btn btn-primary" onClick={handleNext}>
                      See the Impact →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <h3>🎉 Amazing! See the Difference?</h3>
            
            <div className="impact-comparison">
              <div className="before-after">
                <div className="before">
                  <h4>❌ Without Good Prompts</h4>
                  <ul>
                    <li>Vague AI responses that don't help</li>
                    <li>Multiple back-and-forth attempts</li>
                    <li>Frustration and wasted time</li>
                    <li>Still need to write everything yourself</li>
                  </ul>
                  <div className="time-estimate">⏱️ Time spent: 45+ minutes</div>
                </div>

                <div className="after">
                  <h4>✅ With Effective Prompts</h4>
                  <ul>
                    <li>Clear, actionable business insights</li>
                    <li>Executive-ready format immediately</li>
                    <li>Specific recommendations with timelines</li>
                    <li>Professional communication ready to send</li>
                  </ul>
                  <div className="time-estimate success">⏱️ Time spent: 5 minutes</div>
                </div>
              </div>

              <div className="roi-highlight">
                <h4>Your Potential Time Savings</h4>
                <div className="savings-metrics">
                  <div className="metric">
                    <span className="number">40 min</span>
                    <span className="label">Saved per analysis</span>
                  </div>
                  <div className="metric">
                    <span className="number">10+ hours</span>
                    <span className="label">Saved per week</span>
                  </div>
                  <div className="metric">
                    <span className="number">$50K+</span>
                    <span className="label">Annual value of your time</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="next-steps">
              <h4>Ready to master AI for your business?</h4>
              <p>This was just one scenario. We have 20+ business contexts designed specifically for finance leaders like you.</p>
              
              <button className="btn btn-primary btn-large" onClick={onComplete}>
                Start My Learning Journey
              </button>
              <p className="cta-subtitle">2 scenarios free • No credit card required</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .demo-container {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--spacing-6);
        }

        .demo-header {
          text-align: center;
          margin-bottom: var(--spacing-9);
          animation: fadeIn var(--duration-slow) var(--ease-out);
        }

        .demo-header h2 {
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-title1);
          font-weight: var(--font-weight-bold);
          letter-spacing: -0.01em;
        }

        .demo-header p {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-7);
          font-size: var(--font-size-body);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .demo-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-5);
        }

        .progress-bar {
          width: 240px;
          height: 8px;
          background: var(--color-neutral-200);
          border-radius: var(--radius-full);
          overflow: hidden;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
          transition: width var(--duration-slow) var(--ease-out);
          border-radius: var(--radius-full);
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
          border-radius: var(--radius-full);
        }

        .step-content {
          background: var(--color-bg-primary);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-8);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-neutral-200);
          animation: slideUp var(--duration-slow) var(--ease-out);
        }

        .step-content h3 {
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-5);
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-semibold);
          letter-spacing: -0.01em;
        }

        .business-context {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.03), rgba(0, 122, 255, 0.01));
          border-radius: var(--radius-xl);
          padding: var(--spacing-7);
          margin: var(--spacing-7) 0;
          border: 2px solid rgba(0, 122, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .business-context::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--color-primary), var(--color-primary-light));
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .context-header h4 {
          color: var(--color-primary);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .context-header p {
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .context-data {
          margin: var(--spacing-5) 0;
          background: var(--color-bg-primary);
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
          box-shadow: var(--shadow-sm);
        }

        .data-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-3) 0;
          border-bottom: 1px solid var(--color-neutral-200);
          font-weight: var(--font-weight-medium);
        }

        .data-row:last-child {
          border-bottom: none;
        }

        .data-row.variance {
          font-weight: var(--font-weight-semibold);
          border-bottom: 2px solid var(--color-error);
          background: rgba(255, 59, 48, 0.05);
          margin: 0 calc(-1 * var(--spacing-5));
          padding: var(--spacing-3) var(--spacing-5);
          border-radius: var(--radius-medium);
        }

        .label {
          color: var(--color-text-secondary);
        }

        .value {
          color: var(--color-text-primary);
          font-weight: var(--font-weight-semibold);
        }

        .value.negative {
          color: var(--color-error);
          font-weight: var(--font-weight-bold);
        }

        .key-factors {
          margin-top: var(--spacing-5);
        }

        .key-factors h5 {
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-3);
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
        }

        .key-factors ul {
          margin: var(--spacing-3) 0;
          padding-left: var(--spacing-6);
        }

        .key-factors li {
          margin: var(--spacing-2) 0;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .prompt-examples {
          display: grid;
          gap: var(--spacing-5);
          margin: var(--spacing-7) 0;
        }

        .prompt-example {
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          border: 2px solid;
          transition: all var(--duration-normal) var(--ease-out);
          position: relative;
          overflow: hidden;
        }

        .prompt-example:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .prompt-example.poor {
          border-color: var(--color-error);
          background: linear-gradient(135deg, rgba(255, 59, 48, 0.05), rgba(255, 59, 48, 0.02));
        }

        .prompt-example.okay {
          border-color: var(--color-warning);
          background: linear-gradient(135deg, rgba(255, 149, 0, 0.05), rgba(255, 149, 0, 0.02));
        }

        .prompt-example.excellent {
          border-color: var(--color-success);
          background: linear-gradient(135deg, rgba(52, 199, 89, 0.05), rgba(52, 199, 89, 0.02));
        }

        .example-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-4);
        }

        .quality-badge {
          font-weight: var(--font-weight-semibold);
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--radius-full);
          font-size: var(--font-size-footnote);
          border: 1px solid;
        }

        .quality-badge.poor {
          background: rgba(255, 59, 48, 0.1);
          color: var(--color-error);
          border-color: rgba(255, 59, 48, 0.2);
        }

        .quality-badge.okay {
          background: rgba(255, 149, 0, 0.1);
          color: var(--color-warning);
          border-color: rgba(255, 149, 0, 0.2);
        }

        .quality-badge.excellent {
          background: rgba(52, 199, 89, 0.1);
          color: var(--color-success);
          border-color: rgba(52, 199, 89, 0.2);
        }

        .score {
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          font-size: var(--font-size-subheadline);
        }

        .prompt-text {
          font-style: italic;
          margin: var(--spacing-4) 0;
          padding: var(--spacing-4);
          background: var(--color-bg-primary);
          border-radius: var(--radius-medium);
          border-left: 3px solid var(--color-neutral-300);
          font-size: var(--font-size-body);
          line-height: 1.6;
          box-shadow: var(--shadow-sm);
        }

        .example-feedback {
          font-size: var(--font-size-subheadline);
          color: var(--color-text-tertiary);
          font-weight: var(--font-weight-medium);
          line-height: 1.5;
        }

        .business-context-reminder {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.05), rgba(0, 122, 255, 0.02));
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
          margin-bottom: var(--spacing-6);
          border: 2px solid rgba(0, 122, 255, 0.1);
          position: relative;
        }

        .business-context-reminder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-primary);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .business-context-reminder h5 {
          margin-bottom: var(--spacing-3);
          color: var(--color-primary);
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
        }

        .business-context-reminder p {
          color: var(--color-primary);
          font-weight: var(--font-weight-medium);
          line-height: 1.5;
        }

        .prompt-input {
          margin: var(--spacing-7) 0;
        }

        .prompt-input label {
          display: block;
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-3);
          color: var(--color-text-primary);
          font-size: var(--font-size-headline);
        }

        .prompt-input textarea {
          width: 100%;
          padding: var(--spacing-5);
          border: 2px solid var(--color-neutral-300);
          border-radius: var(--radius-large);
          font-size: var(--font-size-body);
          font-family: var(--font-family-system);
          resize: vertical;
          transition: all var(--duration-fast) var(--ease-out);
          background: var(--color-bg-primary);
          color: var(--color-text-primary);
          line-height: 1.6;
          min-height: 120px;
        }

        .prompt-input textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
          transform: translateY(-1px);
        }

        .prompt-input textarea::placeholder {
          color: var(--color-text-tertiary);
        }

        .character-count {
          text-align: right;
          font-size: var(--font-size-footnote);
          color: var(--color-text-tertiary);
          margin-top: var(--spacing-2);
          font-weight: var(--font-weight-medium);
        }

        .prompt-hints {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.03), rgba(0, 122, 255, 0.01));
          border-radius: var(--radius-large);
          padding: var(--spacing-5);
          margin: var(--spacing-6) 0;
          border: 1px solid rgba(0, 122, 255, 0.1);
        }

        .prompt-hints h5 {
          margin-bottom: var(--spacing-3);
          color: var(--color-primary);
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-semibold);
        }

        .prompt-hints ul {
          margin: 0;
          padding-left: var(--spacing-6);
        }

        .prompt-hints li {
          margin: var(--spacing-2) 0;
          color: var(--color-primary);
          font-weight: var(--font-weight-medium);
          line-height: 1.5;
        }

        .ai-response-section {
          margin-top: var(--spacing-8);
          padding-top: var(--spacing-7);
          border-top: 2px solid var(--color-neutral-200);
          animation: slideUp var(--duration-slow) var(--ease-out);
        }

        .ai-response-section h4 {
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-5);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .ai-response {
          background: linear-gradient(135deg, rgba(52, 199, 89, 0.03), rgba(52, 199, 89, 0.01));
          border-radius: var(--radius-xl);
          padding: var(--spacing-7);
          margin: var(--spacing-5) 0;
          border: 2px solid rgba(52, 199, 89, 0.1);
          position: relative;
          overflow: hidden;
        }

        .ai-response::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--color-success);
          border-radius: 0 var(--radius-small) var(--radius-small) 0;
        }

        .response-content {
          position: relative;
          z-index: 2;
        }

        .response-content p {
          margin: var(--spacing-3) 0;
          line-height: 1.6;
          color: var(--color-text-primary);
          font-size: var(--font-size-body);
        }

        .response-content p:first-child {
          margin-top: 0;
        }

        .response-content p:last-child {
          margin-bottom: 0;
        }

        .feedback-section {
          background: linear-gradient(135deg, rgba(52, 199, 89, 0.05), rgba(52, 199, 89, 0.02));
          border-radius: var(--radius-xl);
          padding: var(--spacing-7);
          margin-top: var(--spacing-6);
          text-align: center;
          border: 2px solid rgba(52, 199, 89, 0.1);
          animation: scaleIn var(--duration-normal) var(--ease-spring) 0.2s both;
        }

        .feedback-score {
          margin-bottom: var(--spacing-5);
        }

        .score-number {
          font-size: var(--font-size-large-title);
          font-weight: var(--font-weight-bold);
          color: var(--color-success);
          display: block;
          line-height: 1;
          margin-bottom: var(--spacing-2);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .score-label {
          color: var(--color-success);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-body);
        }

        .feedback-text {
          color: var(--color-success);
          margin-bottom: var(--spacing-7);
          font-size: var(--font-size-headline);
          font-weight: var(--font-weight-medium);
          line-height: 1.4;
        }

        .impact-comparison {
          margin: var(--spacing-8) 0;
        }

        .before-after {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-7);
          margin-bottom: var(--spacing-8);
        }

        .before, .after {
          padding: var(--spacing-7);
          border-radius: var(--radius-xl);
          border: 2px solid;
          transition: all var(--duration-normal) var(--ease-out);
        }

        .before:hover, .after:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .before {
          background: linear-gradient(135deg, rgba(255, 59, 48, 0.05), rgba(255, 59, 48, 0.02));
          border-color: rgba(255, 59, 48, 0.2);
        }

        .after {
          background: linear-gradient(135deg, rgba(52, 199, 89, 0.05), rgba(52, 199, 89, 0.02));
          border-color: rgba(52, 199, 89, 0.2);
        }

        .before h4, .after h4 {
          margin-bottom: var(--spacing-5);
          font-size: var(--font-size-title3);
          font-weight: var(--font-weight-semibold);
        }

        .before h4 {
          color: var(--color-error);
        }

        .after h4 {
          color: var(--color-success);
        }

        .before ul, .after ul {
          margin: var(--spacing-5) 0;
          padding-left: var(--spacing-6);
        }

        .before li, .after li {
          margin: var(--spacing-2) 0;
          line-height: 1.5;
        }

        .before li {
          color: var(--color-error);
        }

        .after li {
          color: var(--color-success);
        }

        .time-estimate {
          font-weight: var(--font-weight-semibold);
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-full);
          text-align: center;
          margin-top: var(--spacing-5);
          font-size: var(--font-size-subheadline);
        }

        .time-estimate:not(.success) {
          background: rgba(255, 59, 48, 0.1);
          color: var(--color-error);
          border: 1px solid rgba(255, 59, 48, 0.2);
        }

        .time-estimate.success {
          background: rgba(52, 199, 89, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(52, 199, 89, 0.2);
        }

        .roi-highlight {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          color: white;
          padding: var(--spacing-8);
          border-radius: var(--radius-2xl);
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .roi-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          transform: translate(50%, -50%);
        }

        .roi-highlight h4 {
          margin-bottom: var(--spacing-7);
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-semibold);
          position: relative;
          z-index: 2;
        }

        .savings-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-7);
          position: relative;
          z-index: 2;
        }

        .metric {
          text-align: center;
        }

        .metric .number {
          display: block;
          font-size: var(--font-size-large-title);
          font-weight: var(--font-weight-bold);
          color: var(--color-warning);
          line-height: 1;
          margin-bottom: var(--spacing-2);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .metric .label {
          font-size: var(--font-size-subheadline);
          opacity: 0.95;
          font-weight: var(--font-weight-medium);
        }

        .next-steps {
          text-align: center;
          margin-top: var(--spacing-8);
        }

        .next-steps h4 {
          margin-bottom: var(--spacing-4);
          color: var(--color-text-primary);
          font-size: var(--font-size-title2);
          font-weight: var(--font-weight-semibold);
        }

        .next-steps p {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-7);
          font-size: var(--font-size-body);
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-subtitle {
          margin-top: var(--spacing-4);
          color: var(--color-text-tertiary);
          font-size: var(--font-size-subheadline);
        }

        .step-action {
          margin-top: var(--spacing-7);
          text-align: center;
        }

        .step-action p {
          margin-bottom: var(--spacing-6);
          font-size: var(--font-size-headline);
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .demo-container {
            padding: var(--spacing-5);
          }

          .step-content {
            padding: var(--spacing-6);
          }

          .before-after {
            grid-template-columns: 1fr;
            gap: var(--spacing-5);
          }

          .savings-metrics {
            grid-template-columns: 1fr;
            gap: var(--spacing-5);
          }

          .progress-bar {
            width: 180px;
          }

          .demo-header h2 {
            font-size: var(--font-size-title2);
          }

          .step-content h3 {
            font-size: var(--font-size-title3);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .demo-header,
          .step-content,
          .ai-response-section,
          .feedback-section {
            animation: none;
          }
          
          .progress-fill::after {
            animation: none;
          }
          
          .before:hover,
          .after:hover,
          .prompt-example:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}

export default InteractiveDemo