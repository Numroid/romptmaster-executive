import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Help = () => {
  const navigate = useNavigate()
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'How does PromptMaster Executive work?',
      answer: 'PromptMaster Executive is an interactive learning platform that teaches you how to write effective prompts for AI systems. You progress through 50 real business scenarios, receive AI-powered feedback on your prompts, and earn points, badges, and certificates as you improve your skills.'
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'What are the 4 learning modules?',
      answer: 'Module 1 (Foundation): Learn basic prompt structure and formatting. Module 2 (Intermediate): Master advanced techniques like few-shot prompting and chain-of-thought. Module 3 (Advanced): Apply skills to complex business scenarios. Module 4 (Expert): Build prompt libraries and master industry-specific applications.'
    },
    {
      id: 3,
      category: 'Scenarios & Learning',
      question: 'How are my prompts evaluated?',
      answer: 'Your prompts are evaluated by Claude Haiku 4.5 AI based on multiple criteria including clarity, specificity, context setting, format instructions, and business value. You receive a detailed score breakdown, strengths, areas for improvement, and a rewritten example showing best practices.'
    },
    {
      id: 4,
      category: 'Scenarios & Learning',
      question: 'Can I retry a scenario?',
      answer: 'Yes! You can retry any scenario as many times as you want. Each attempt helps you learn and improve. Your highest score is saved for progress tracking, but you can always go back and try to achieve a perfect score.'
    },
    {
      id: 5,
      category: 'Scenarios & Learning',
      question: 'How long does each scenario take?',
      answer: 'Most scenarios take 10-15 minutes to complete. Foundation scenarios are typically shorter (5-10 min), while advanced scenarios may take 15-20 minutes. You can pause and return to scenarios at any time.'
    },
    {
      id: 6,
      category: 'Progress & Gamification',
      question: 'How do points and levels work?',
      answer: 'You earn points for completing scenarios (base 100 points), with bonuses for high scores (90%+ = 50 bonus, 80%+ = 25 bonus), speed, and daily streaks. Every 500 points advances you to the next level. Track your progress on the Dashboard.'
    },
    {
      id: 7,
      category: 'Progress & Gamification',
      question: 'What are achievements and how do I unlock them?',
      answer: 'Achievements are badges earned by reaching specific milestones: completing your first scenario, maintaining a 7-day streak, scoring 90%+ on 10 scenarios, completing modules, achieving perfect scores, and more. View all achievements on your Dashboard.'
    },
    {
      id: 8,
      category: 'Progress & Gamification',
      question: 'What is the streak system?',
      answer: 'Your streak tracks consecutive days of completing at least one scenario. Longer streaks earn you bonus points (up to 70 points per day). Streaks reset if you miss a day, so try to maintain your momentum!'
    },
    {
      id: 9,
      category: 'Certification',
      question: 'How do I earn my certificate?',
      answer: 'To earn your PromptMaster Executive certificate, you must: (1) Complete all 50 scenarios, (2) Achieve a 70%+ average score across all scenarios, and (3) Pass the capstone project. Once eligible, you can generate and download your certificate from the Dashboard.'
    },
    {
      id: 10,
      category: 'Certification',
      question: 'What is the capstone project?',
      answer: 'The capstone is the final certification scenario that tests your mastery of all prompt engineering techniques. It\'s an open-ended business challenge where you build a comprehensive AI prompt template library. You need 85%+ to pass.'
    },
    {
      id: 11,
      category: 'Certification',
      question: 'Can I share my certificate?',
      answer: 'Yes! Your certificate includes social sharing buttons for LinkedIn, Twitter, and Facebook. It also has a unique verification URL that anyone can use to confirm its authenticity. Certificates can be downloaded as PDF and printed.'
    },
    {
      id: 12,
      category: 'Technical',
      question: 'What browsers are supported?',
      answer: 'PromptMaster Executive works best on modern browsers: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. For the best experience, keep your browser updated to the latest version.'
    },
    {
      id: 13,
      category: 'Technical',
      question: 'Is my progress saved automatically?',
      answer: 'Yes! Your progress, scores, achievements, and streak data are automatically saved to our secure servers after each action. You can access your account from any device and pick up right where you left off.'
    },
    {
      id: 14,
      category: 'Technical',
      question: 'Can I use PromptMaster on mobile?',
      answer: 'Yes! PromptMaster Executive is fully responsive and works on tablets and mobile devices. However, for the best learning experience, we recommend using a desktop or laptop for writing longer prompts.'
    }
  ]

  const categories = [...new Set(faqs.map(faq => faq.category))]

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="help-page">
      {/* Header */}
      <header className="help-header">
        <div className="container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="help-title">Help & FAQ</h1>
          <p className="help-subtitle">Everything you need to know about PromptMaster Executive</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="help-content">
        <div className="container">
          {/* Quick Links */}
          <section className="quick-links card">
            <h2>Quick Links</h2>
            <div className="links-grid">
              <button className="link-card" onClick={() => navigate('/scenarios')}>
                <div className="link-icon">🎯</div>
                <div className="link-title">Browse Scenarios</div>
                <div className="link-description">Start learning</div>
              </button>
              <button className="link-card" onClick={() => navigate('/dashboard')}>
                <div className="link-icon">📊</div>
                <div className="link-title">View Progress</div>
                <div className="link-description">Track your stats</div>
              </button>
              <button className="link-card" onClick={() => setOpenFAQ(9)}>
                <div className="link-icon">🎓</div>
                <div className="link-title">Certification</div>
                <div className="link-description">Earn your certificate</div>
              </button>
              <button className="link-card" onClick={() => setOpenFAQ(6)}>
                <div className="link-icon">⚡</div>
                <div className="link-title">Points & Levels</div>
                <div className="link-description">How it works</div>
              </button>
            </div>
          </section>

          {/* FAQ by Category */}
          {categories.map(category => (
            <section key={category} className="faq-category">
              <h2 className="category-title">{category}</h2>
              <div className="faq-list">
                {faqs.filter(faq => faq.category === category).map(faq => (
                  <div key={faq.id} className={`faq-item card ${openFAQ === faq.id ? 'open' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => toggleFAQ(faq.id)}
                      aria-expanded={openFAQ === faq.id}
                    >
                      <span>{faq.question}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="faq-arrow"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFAQ === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Contact Section */}
          <section className="contact-section card-navy">
            <div className="contact-content">
              <h2>Still have questions?</h2>
              <p>
                Can't find the answer you're looking for? We're here to help!
              </p>
              <a href="mailto:support@promptmaster.ai" className="btn btn-primary btn-lg">
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .help-page {
          min-height: 100vh;
          background: linear-gradient(180deg, var(--gray-900) 0%, var(--navy-900) 100%);
        }

        .help-header {
          background: rgba(26, 26, 26, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: var(--space-8) 0;
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          cursor: pointer;
          padding: var(--space-2);
          margin-bottom: var(--space-4);
          transition: color var(--transition-base);
        }

        .back-button:hover {
          color: var(--text-primary);
        }

        .back-button svg {
          width: 20px;
          height: 20px;
        }

        .help-title {
          font-size: var(--text-5xl);
          font-weight: var(--font-bold);
          background: linear-gradient(135deg, var(--orange-500), var(--orange-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 var(--space-3) 0;
        }

        .help-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin: 0;
        }

        .help-content {
          padding: var(--space-12) 0;
        }

        /* Quick Links */
        .quick-links {
          margin-bottom: var(--space-12);
          padding: var(--space-8);
        }

        .quick-links h2 {
          font-size: var(--text-2xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-6) 0;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .link-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: var(--space-6);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .link-card:hover {
          border-color: var(--orange-500);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .link-icon {
          font-size: 40px;
          margin-bottom: var(--space-3);
        }

        .link-title {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .link-description {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        /* FAQ Categories */
        .faq-category {
          margin-bottom: var(--space-10);
        }

        .category-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-6) 0;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .faq-item {
          padding: 0;
          overflow: hidden;
          transition: all var(--transition-base);
        }

        .faq-item.open {
          border-color: var(--orange-500);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          background: none;
          border: none;
          padding: var(--space-5);
          text-align: left;
          cursor: pointer;
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          transition: background var(--transition-base);
        }

        .faq-question:hover {
          background: var(--bg-secondary);
        }

        .faq-arrow {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          transition: transform var(--transition-base);
          color: var(--text-tertiary);
        }

        .faq-item.open .faq-arrow {
          transform: rotate(180deg);
          color: var(--orange-500);
        }

        .faq-answer {
          padding: 0 var(--space-5) var(--space-5) var(--space-5);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-answer p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0;
        }

        /* Contact Section */
        .contact-section {
          margin-top: var(--space-12);
          padding: var(--space-10);
          text-align: center;
          background: linear-gradient(135deg, var(--navy-700), var(--navy-800));
          border: 1px solid var(--navy-600);
        }

        .contact-content h2 {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0 0 var(--space-3) 0;
        }

        .contact-content p {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin: 0 0 var(--space-6) 0;
        }

        @media (max-width: 768px) {
          .help-title {
            font-size: var(--text-3xl);
          }

          .links-grid {
            grid-template-columns: 1fr 1fr;
          }

          .category-title {
            font-size: var(--text-2xl);
          }

          .contact-content h2 {
            font-size: var(--text-2xl);
          }
        }

        @media (max-width: 480px) {
          .links-grid {
            grid-template-columns: 1fr;
          }

          .help-title {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </div>
  )
}

export default Help
