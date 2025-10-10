# PromptMaster Executive

A gamified web application that teaches prompt engineering to senior finance and business leaders through realistic business scenarios.

## Features

- **Executive-First Experience**: Clean, professional interface designed for business leaders
- **Business-Focused Scenarios**: Practice with realistic budget analysis, risk assessment, and strategic planning contexts
- **Progressive Learning**: Skill-building path from beginner to advanced prompt engineering
- **Gamified Progress**: Achievements, progress tracking, and peer comparisons
- **OAuth Authentication**: Secure login with Google/Microsoft accounts

## Tech Stack

- **Frontend**: React 18 with Vite
- **Authentication**: Auth0 with Google/Microsoft OAuth
- **Styling**: CSS-in-JS with styled-components
- **Testing**: Vitest with React Testing Library
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Auth0 account for authentication setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd promptmaster-executive
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with Auth0 credentials:
```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_API_BASE_URL=http://localhost:3001/api
```

### Auth0 Setup

1. Create an Auth0 application:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new Single Page Application
   - Configure Allowed Callback URLs: `http://localhost:3000`
   - Configure Allowed Logout URLs: `http://localhost:3000`
   - Configure Allowed Web Origins: `http://localhost:3000`

2. Enable Google/Microsoft social connections:
   - Go to Authentication > Social
   - Enable Google and Microsoft connections
   - Configure with your OAuth app credentials

### Development

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.jsx     # Marketing landing page
│   ├── OnboardingFlow.jsx  # User registration flow
│   ├── Dashboard.jsx       # Main user dashboard
│   └── LoadingSpinner.jsx  # Loading component
├── services/           # API and business logic
│   └── userService.js     # User profile operations
├── tests/              # Test files
│   ├── setup.js           # Test configuration
│   ├── App.test.jsx       # App component tests
│   └── userService.test.js # Service layer tests
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## User Flow

1. **Landing Page**: Value proposition with ROI calculator and signup CTA
2. **Authentication**: OAuth login with Google/Microsoft
3. **Onboarding**: 3-step profile setup (role, company, experience)
4. **Dashboard**: Progress overview and learning path navigation

## Authentication Flow

The app uses Auth0 for authentication with the following flow:

1. User clicks "Sign In" or "Start Free Trial"
2. Redirected to Auth0 Universal Login
3. User authenticates with Google/Microsoft
4. Redirected back to app with authentication token
5. If first login, user completes onboarding flow
6. User profile is created and stored
7. User is redirected to main dashboard

## Data Models

### User Profile
```javascript
{
  id: string,
  auth0Id: string,
  email: string,
  name: string,
  role: string,           // CFO, VP Finance, etc.
  companySize: string,    // <100, 100-1000, etc.
  industry: string,       // Technology, Financial Services, etc.
  aiExperience: string,   // Beginner, Some Experience, Experienced
  onboardingCompleted: boolean,
  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

### User Progress
```javascript
{
  userId: string,
  currentLevel: string,   // beginner, developing, proficient, advanced
  totalPoints: number,
  scenariosCompleted: number,
  currentStreak: number,
  longestStreak: number,
  lastActivityAt: timestamp,
  skillScores: {
    clarity: number,
    specificity: number,
    businessContext: number,
    efficiency: number
  }
}
```

## Development Notes

- The app is designed to work with Vibe's no-code platform constraints
- Mock services are included for development without a backend
- Responsive design works across desktop, tablet, and mobile
- All components use CSS-in-JS for styling consistency

## Next Steps

This foundation supports the following upcoming features:
- Scenario engine with OpenAI integration
- Progress tracking and gamification
- Stripe payment integration
- Content management system
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.