# PromptMaster Executive - Deployment Guide

This guide covers deploying the PromptMaster Executive application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Auth0 Configuration](#auth0-configuration)
7. [Anthropic API Setup](#anthropic-api-setup)
8. [Email Service Setup](#email-service-setup)
9. [Domain & SSL](#domain--ssl)
10. [Monitoring & Analytics](#monitoring--analytics)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 20+ installed
- [ ] PostgreSQL 15+ database
- [ ] Auth0 account (free tier available)
- [ ] Anthropic API key
- [ ] Vercel account (for frontend)
- [ ] Railway/Render account (for backend)
- [ ] Domain name (optional but recommended)
- [ ] Git repository

---

## Environment Setup

### Frontend Environment Variables

Create `.env.production` in the frontend root:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.promptmaster.ai
VITE_AUTH0_REDIRECT_URI=https://promptmaster.ai

# API Configuration
VITE_API_URL=https://api.promptmaster.ai

# Analytics (Optional)
VITE_MIXPANEL_TOKEN=your-mixpanel-token
VITE_SENTRY_DSN=your-sentry-dsn

# Environment
NODE_ENV=production
```

### Backend Environment Variables

Create `.env.production` in the backend root:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://promptmaster.ai

# Database
DATABASE_URL=postgresql://user:password@host:5432/promptmaster

# Auth0
AUTH0_DOMAIN=your-domain.us.auth0.com
AUTH0_AUDIENCE=https://api.promptmaster.ai
AUTH0_CLIENT_ID=your-management-api-client-id
AUTH0_CLIENT_SECRET=your-management-api-secret

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-haiku-4.5-20241022

# Email Service (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@promptmaster.ai

# Session Secret
SESSION_SECRET=your-super-secret-key-change-this

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# CDN (for certificates)
CDN_URL=https://cdn.promptmaster.ai
```

---

## Database Setup

### 1. Create PostgreSQL Database

**Using Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql

# Get connection string
railway variables
```

**Using Supabase:**
1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings > Database

### 2. Run Migrations

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed initial data (scenarios, achievements)
npm run seed
```

### 3. Database Schema

The migration creates these tables:
- `users` - User profiles synced from Auth0
- `scenarios` - 50 learning scenarios
- `attempts` - User prompt submissions and scores
- `progress` - User progress tracking
- `achievements` - Achievement badges
- `certificates` - Generated certificates
- `sessions` - Session management

---

## Backend Deployment

### Option 1: Railway

1. **Create Railway Project:**
   ```bash
   railway init
   railway add postgresql
   ```

2. **Configure Build:**
   Create `railway.json`:
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm install && npm run build"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set AUTH0_DOMAIN=your-domain.us.auth0.com
   # ... set all other variables
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Option 2: Render

1. **Create `render.yaml`:**
   ```yaml
   services:
     - type: web
       name: promptmaster-api
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: DATABASE_URL
           fromDatabase:
             name: promptmaster-db
             property: connectionString

   databases:
     - name: promptmaster-db
       plan: starter
       databaseName: promptmaster
       user: promptmaster_user
   ```

2. **Deploy:**
   - Push to GitHub
   - Connect repository in Render dashboard
   - Deploy automatically on push

### Option 3: Docker

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 5000

   CMD ["npm", "start"]
   ```

2. **Create `docker-compose.yml`:**
   ```yaml
   version: '3.8'

   services:
     api:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=postgresql://postgres:password@db:5432/promptmaster
       depends_on:
         - db

     db:
       image: postgres:15-alpine
       environment:
         POSTGRES_DB: promptmaster
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

---

## Frontend Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Configure Build:**
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables:**
   ```bash
   vercel env add VITE_AUTH0_DOMAIN
   vercel env add VITE_AUTH0_CLIENT_ID
   vercel env add VITE_API_URL
   # Enter values when prompted
   ```

### Alternative: Netlify

1. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "20"
   ```

2. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

---

## Auth0 Configuration

### 1. Create Auth0 Application

1. Go to https://auth0.com
2. Create new application (Single Page Application)
3. Configure settings:
   - **Allowed Callback URLs**: `https://promptmaster.ai`
   - **Allowed Logout URLs**: `https://promptmaster.ai`
   - **Allowed Web Origins**: `https://promptmaster.ai`
   - **Allowed Origins (CORS)**: `https://promptmaster.ai`

### 2. Create Auth0 API

1. Create new API
2. Set identifier: `https://api.promptmaster.ai`
3. Enable RBAC (optional for future roles)

### 3. Configure Rules/Actions

Create an Action to sync user data:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://promptmaster.ai';

  if (event.stats.logins_count === 1) {
    // First login - create user in database
    await fetch(`${process.env.API_URL}/api/user/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${event.secrets.API_SECRET}`
      },
      body: JSON.stringify({
        user_id: event.user.user_id,
        email: event.user.email,
        name: event.user.name,
        picture: event.user.picture
      })
    });
  }
};
```

---

## Anthropic API Setup

### 1. Get API Key

1. Sign up at https://console.anthropic.com
2. Generate API key
3. Add to backend environment variables

### 2. Configure Prompt Caching

Update `backend/src/services/claudeService.js`:

```javascript
const response = await anthropic.messages.create({
  model: 'claude-haiku-4.5-20241022',
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: scenarioContext,
      cache_control: { type: "ephemeral" } // Cache scenario context
    }
  ],
  messages: [
    { role: "user", content: userPrompt }
  ]
});
```

### 3. Monitor Usage

- Check dashboard: https://console.anthropic.com
- Set budget alerts
- Monitor cache hit rates

---

## Email Service Setup

### Using Resend

1. **Sign up**: https://resend.com
2. **Verify domain**:
   ```bash
   # Add DNS records
   Type: TXT
   Name: @
   Value: resend-verify=xxx
   ```

3. **Generate API key**
4. **Create email template** (`backend/emails/certificate.html`):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <title>Your PromptMaster Certificate</title>
   </head>
   <body>
     <h1>Congratulations, {{name}}!</h1>
     <p>You've earned your PromptMaster Executive certificate.</p>
     <a href="{{certificate_url}}">View Certificate</a>
   </body>
   </html>
   ```

---

## Domain & SSL

### 1. Configure Custom Domain

**Vercel:**
```bash
vercel domains add promptmaster.ai
```

**Add DNS Records:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 2. Configure API Subdomain

```
Type: CNAME
Name: api
Value: your-backend.railway.app
```

### 3. SSL Certificates

- Vercel/Netlify: Automatic SSL via Let's Encrypt
- Railway: Automatic SSL
- Custom: Use Cloudflare for SSL termination

---

## Monitoring & Analytics

### 1. Sentry (Error Monitoring)

```bash
npm install @sentry/react @sentry/node
```

**Frontend** (`src/main.jsx`):
```javascript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 1.0,
});
```

**Backend** (`src/app.js`):
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Mixpanel (Analytics)

```bash
npm install mixpanel-browser
```

```javascript
import mixpanel from 'mixpanel-browser'

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN)

// Track events
mixpanel.track('Scenario Completed', {
  scenario_id: 1,
  score: 85
})
```

### 3. Uptime Monitoring

Use UptimeRobot or similar:
- Monitor: `https://api.promptmaster.ai/health`
- Alert on downtime

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_AUTH0_DOMAIN: ${{ secrets.AUTH0_DOMAIN }}
          VITE_AUTH0_CLIENT_ID: ${{ secrets.AUTH0_CLIENT_ID }}
          VITE_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: promptmaster-api
```

---

## Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test Auth0 login flow
- [ ] Submit test prompt and verify AI evaluation
- [ ] Check database connections
- [ ] Verify email delivery
- [ ] Test certificate generation
- [ ] Check error monitoring (Sentry)
- [ ] Verify analytics tracking
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check SSL certificate validity
- [ ] Test 404 and error pages
- [ ] Verify API rate limiting
- [ ] Check CORS configuration
- [ ] Test all user flows end-to-end

---

## Troubleshooting

### Issue: Auth0 Login Redirects to Wrong URL

**Solution:**
- Check `VITE_AUTH0_REDIRECT_URI` matches Auth0 settings
- Verify allowed callback URLs in Auth0 dashboard

### Issue: API Returns 401 Unauthorized

**Solution:**
- Verify JWT token is being sent in Authorization header
- Check Auth0 audience matches backend configuration
- Ensure Auth0 API identifier is correct

### Issue: Database Connection Errors

**Solution:**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/db`
- Check database is accessible from backend server
- Verify SSL mode if required: `?sslmode=require`

### Issue: Anthropic API Rate Limits

**Solution:**
- Implement request queuing
- Add retry logic with exponential backoff
- Monitor usage and upgrade plan if needed

### Issue: CORS Errors

**Solution:**
- Add frontend URL to `CORS_ORIGIN` environment variable
- Verify backend CORS middleware configuration
- Check for trailing slashes in URLs

### Issue: Email Not Sending

**Solution:**
- Verify Resend API key is correct
- Check domain verification status
- Review email template for errors
- Check spam folder

---

## Scaling Considerations

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_attempts_user_scenario ON attempts(user_id, scenario_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_achievements_user ON user_achievements(user_id);
```

### Caching Strategy

```javascript
// Redis for session caching
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache user progress
await client.setEx(
  `progress:${userId}`,
  3600, // 1 hour
  JSON.stringify(progressData)
);
```

### CDN for Static Assets

- Use Cloudflare for static files
- Enable caching for certificates
- Optimize images with CDN

---

## Security Best Practices

- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on all endpoints
- [ ] Implement CSRF protection
- [ ] Use HTTPS everywhere
- [ ] Validate all user inputs
- [ ] Sanitize database queries (use parameterized queries)
- [ ] Enable security headers (CSP, HSTS, etc.)
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use Auth0 MFA (Multi-Factor Authentication)

---

## Backup & Recovery

### Database Backups

```bash
# Automated daily backups (Railway/Supabase provide this)
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240115.sql
```

### Application Backups

- Git repository (code)
- Database snapshots (daily)
- User-uploaded content (if any)
- Configuration backups

---

## Support Resources

- **Documentation**: https://docs.promptmaster.ai
- **Status Page**: https://status.promptmaster.ai
- **Community**: https://community.promptmaster.ai
- **Email**: support@promptmaster.ai

---

**Last Updated**: January 2024
**Version**: 1.0.0
