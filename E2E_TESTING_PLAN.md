# End-to-End Testing Plan - PromptMaster Executive

## Testing Objective
Validate the entire application from a customer's perspective, ensuring all features work correctly and provide a seamless user experience.

## Testing Approach
- Act as a real customer/end-user
- Test all critical user journeys
- Validate both happy paths and error scenarios
- Check UI/UX consistency
- Verify data persistence
- Test performance and responsiveness

---

## Test Cases

### TC-01: Landing Page & Navigation
**Priority:** High
**Objective:** Verify landing page loads correctly and navigation works

**Test Steps:**
1. Navigate to http://localhost:5000
2. Verify page loads without errors
3. Check all sections are visible (hero, features, how it works, pricing)
4. Verify "Try Demo" button functionality
5. Verify "Get Started" button functionality
6. Check footer links
7. Verify responsive design on different screen sizes

**Expected Results:**
- Landing page loads in < 3 seconds
- All content is properly styled
- Buttons are clickable and navigate correctly
- No console errors
- Mobile view is properly formatted

---

### TC-02: Authentication Flow
**Priority:** Critical
**Objective:** Verify Auth0 integration and login/signup process

**Test Steps:**
1. Click "Get Started" button
2. Verify Auth0 login modal appears
3. Test Google OAuth login
4. Test Microsoft OAuth login
5. Verify JWT token is received and stored
6. Check user session persistence
7. Test logout functionality
8. Test protected routes (should redirect to login if not authenticated)

**Expected Results:**
- Auth0 modal loads correctly
- OAuth providers work
- User is redirected to dashboard after successful login
- Token is stored in localStorage/cookies
- Protected routes are inaccessible without authentication
- Logout clears session properly

---

### TC-03: Onboarding Flow
**Priority:** Medium
**Objective:** Verify new user onboarding experience

**Test Steps:**
1. Login as a new user
2. Check if onboarding modal/screens appear
3. Navigate through onboarding steps
4. Verify data is saved (role, experience level, goals)
5. Check skip functionality (if available)
6. Verify transition to dashboard

**Expected Results:**
- Onboarding appears only for new users
- All steps are navigable
- Data is saved to database
- User can skip if needed
- Dashboard loads after completion

---

### TC-04: Dashboard View
**Priority:** High
**Objective:** Verify dashboard displays correct user data

**Test Steps:**
1. Login and navigate to dashboard
2. Verify user profile information is displayed
3. Check statistics section (total points, scenarios completed, current streak, etc.)
4. Verify skill spider chart renders correctly
5. Check module progress indicators
6. Verify recent activity feed
7. Check achievement badges display
8. Verify "Continue Learning" button works

**Expected Results:**
- All user data displays correctly
- Charts render without errors
- Statistics match database values
- Progress bars show correct percentages
- Recent activity shows latest attempts
- Navigation to scenarios works

---

### TC-05: Scenario Selection
**Priority:** High
**Objective:** Verify scenario browsing and selection

**Test Steps:**
1. Navigate to scenario selection page
2. Verify all modules are displayed (Foundation, Intermediate, Advanced, Expert)
3. Check scenario cards show correct information (title, difficulty, industry, estimated time)
4. Verify locked scenarios (if progressive unlocking is enabled)
5. Click on a scenario to open it
6. Verify scenario details modal/page
7. Check "Start Scenario" button

**Expected Results:**
- All 50 scenarios are listed
- Modules are properly organized
- Locked scenarios show unlock requirements
- Scenario metadata is accurate
- Selection leads to scenario player
- No duplicate scenarios

---

### TC-06: Scenario Player - Basic Functionality
**Priority:** Critical
**Objective:** Verify scenario player interface and basic interactions

**Test Steps:**
1. Open a scenario
2. Verify scenario context is displayed clearly
3. Check "Your Role" section
4. Check "Your Task" section
5. Check "Success Criteria" section
6. Verify prompt input textarea is functional
7. Check character/word counter (if available)
8. Test "View Hints" functionality
9. Test "Submit Prompt" button (before entering text)
10. Enter a sample prompt and verify Submit button enables

**Expected Results:**
- All scenario sections are readable
- Formatting is correct
- Input area is responsive
- Hints are helpful and contextual
- Submit requires valid input
- No UI glitches

---

### TC-07: Prompt Submission & AI Evaluation
**Priority:** Critical
**Objective:** Verify prompt submission and AI evaluation process

**Test Steps:**
1. Enter a well-crafted prompt (following success criteria)
2. Click "Submit Prompt"
3. Verify loading state appears
4. Wait for AI evaluation
5. Check evaluation response time
6. Verify feedback modal appears
7. Check overall score display
8. Verify criteria scores (Clarity, Specificity, Context, etc.)
9. Check "What Went Well" section
10. Check "Areas for Improvement" section
11. Check "Suggested Rewrite" (if score < 70)
12. Verify points awarded
13. Check if achievements are unlocked
14. Test "Try Again" vs "Next Scenario" options

**Expected Results:**
- Submission processes without errors
- Loading indicator appears
- Evaluation completes in < 10 seconds
- Score is between 0-100
- All criteria have scores
- Feedback is relevant and helpful
- Points are calculated correctly
- Achievements unlock appropriately
- Navigation options work

---

### TC-08: Prompt Submission - Edge Cases
**Priority:** High
**Objective:** Test edge cases in prompt submission

**Test Steps:**
1. Submit empty prompt
2. Submit very short prompt (< 10 characters)
3. Submit very long prompt (> 5000 characters)
4. Submit prompt with special characters
5. Submit prompt with code blocks
6. Submit prompt with emojis
7. Test rapid successive submissions
8. Test submission while another is processing

**Expected Results:**
- Empty/short prompts show validation error
- Long prompts are accepted or show appropriate limit
- Special characters are handled correctly
- API doesn't break with unusual inputs
- Duplicate submissions are prevented
- Loading states prevent double submission

---

### TC-09: Progress Tracking
**Priority:** High
**Objective:** Verify progress is tracked and persisted correctly

**Test Steps:**
1. Note initial statistics (points, scenarios completed, etc.)
2. Complete a scenario
3. Return to dashboard
4. Verify statistics are updated
5. Check skill scores are updated based on scenario
6. Verify module progress percentage increases
7. Check recent activity shows the new attempt
8. Logout and login again
9. Verify progress is persisted

**Expected Results:**
- All stats update immediately after scenario completion
- Skill scores reflect performance
- Module progress is accurate
- History is maintained
- Data persists across sessions
- No data loss

---

### TC-10: Achievement System
**Priority:** Medium
**Objective:** Verify achievements unlock correctly

**Test Steps:**
1. Check initial achievements status
2. Trigger achievement conditions:
   - First Steps: Complete first scenario
   - Week Warrior: Login 7 days in a row
   - Quality Master: Get 3 scores above 90
   - Speed Demon: Complete scenario in under 5 minutes
   - Perfectionist: Get perfect 100 score
   - Social Butterfly: Share on LinkedIn (if implemented)
3. Verify achievement unlock notification
4. Check achievement badge appears on dashboard
5. Verify achievement metadata (unlock date, description)

**Expected Results:**
- Achievements unlock when conditions are met
- Notifications are visible and celebratory
- Badges display correctly
- Achievement progress is tracked
- No duplicate unlocks

---

### TC-11: Leaderboard
**Priority:** Medium
**Objective:** Verify leaderboard displays rankings correctly

**Test Steps:**
1. Navigate to leaderboard page
2. Verify ranking algorithm (by total points)
3. Check top 10/50/100 users display
4. Verify current user's rank is highlighted
5. Check user profile information (name, avatar, points, scenarios completed)
6. Test filtering options (weekly, monthly, all-time if available)
7. Verify pagination (if applicable)
8. Test leaderboard updates after completing scenarios

**Expected Results:**
- Rankings are accurate
- Data is sorted correctly
- Current user is highlighted
- Filters work properly
- Updates reflect recent activity
- No performance issues with large datasets

---

### TC-12: Certificate Generation
**Priority:** High
**Objective:** Verify certificate system for capstone completion

**Test Steps:**
1. Complete all prerequisites for capstone
2. Complete capstone scenario with passing score
3. Verify certificate generation trigger
4. Check certificate PDF generation
5. Verify certificate contains:
   - User name
   - Completion date
   - Unique verification ID
   - Professional design
6. Test certificate download
7. Test certificate verification URL
8. Test LinkedIn badge sharing (if implemented)
9. Check certificate record in database

**Expected Results:**
- Certificate generates automatically after capstone
- PDF is properly formatted
- All required information is present
- Download works in all browsers
- Verification URL is publicly accessible
- Certificate ID is unique
- LinkedIn integration works

---

### TC-13: Help System & Guides
**Priority:** Low
**Objective:** Verify help resources are accessible and helpful

**Test Steps:**
1. Navigate to Help section
2. Check technique guides (RISEN, CO-STAR, etc.)
3. Verify examples are clear
4. Check FAQ section (if available)
5. Test search functionality (if available)
6. Verify contact/support options
7. Check accessibility from different pages

**Expected Results:**
- Help content is well-organized
- Examples are practical
- Navigation is intuitive
- Search returns relevant results
- Support channels are clear
- Content is up-to-date

---

### TC-14: Responsive Design
**Priority:** High
**Objective:** Verify application works on different devices

**Test Steps:**
1. Test on Desktop (1920x1080, 1366x768)
2. Test on Tablet (iPad, Android tablet)
3. Test on Mobile (iPhone, Android phone)
4. Check specific components:
   - Navigation menu (hamburger on mobile)
   - Dashboard layout
   - Scenario player
   - Feedback modal
   - Charts and graphs
5. Test touch interactions on mobile
6. Check text readability
7. Verify button sizes are touch-friendly

**Expected Results:**
- Layout adapts to all screen sizes
- No horizontal scrolling (unless intentional)
- Content is readable
- Interactive elements are accessible
- Charts are responsive
- Touch targets are appropriately sized

---

### TC-15: Error Handling
**Priority:** High
**Objective:** Verify graceful error handling

**Test Steps:**
1. Test with backend server stopped
2. Test with invalid API responses
3. Test with network disconnection
4. Test with expired JWT token
5. Test 404 routes
6. Test database connection errors
7. Test Anthropic API errors/rate limits
8. Test invalid user inputs
9. Check error messages are user-friendly
10. Verify error boundaries prevent app crashes

**Expected Results:**
- Friendly error messages (not technical jargon)
- App doesn't crash
- User can recover from errors
- Errors are logged properly
- Loading states handle errors gracefully
- Retry mechanisms work

---

### TC-16: Performance Testing
**Priority:** Medium
**Objective:** Verify application performance meets standards

**Test Steps:**
1. Measure page load times
2. Test API response times
3. Check bundle size
4. Test with slow 3G network
5. Check memory usage
6. Test with 100+ scenarios loaded
7. Verify lazy loading of components
8. Check database query performance

**Expected Results:**
- Landing page loads in < 3s
- Dashboard loads in < 2s
- API responses in < 1s (except AI evaluation)
- AI evaluation in < 10s
- Bundle size is optimized
- App works on slow networks
- No memory leaks

---

### TC-17: Data Persistence & Integrity
**Priority:** Critical
**Objective:** Verify data is stored and retrieved correctly

**Test Steps:**
1. Submit multiple scenario attempts
2. Verify all attempts are recorded in database
3. Check data consistency across tables
4. Test concurrent user submissions
5. Verify foreign key relationships
6. Check data validation at database level
7. Test data migration/updates don't corrupt data

**Expected Results:**
- All user actions are persisted
- Database constraints are enforced
- No data corruption
- Concurrent operations handled correctly
- Referential integrity maintained

---

### TC-18: Security Testing
**Priority:** Critical
**Objective:** Verify basic security measures

**Test Steps:**
1. Test JWT token validation
2. Try accessing API without authentication
3. Test for XSS vulnerabilities (inject scripts in prompts)
4. Test for SQL injection (if any raw queries)
5. Verify CORS configuration
6. Check environment variables are not exposed
7. Test rate limiting on APIs
8. Verify Auth0 configuration

**Expected Results:**
- All protected routes require valid JWT
- Expired tokens are rejected
- XSS attempts are sanitized
- SQL injection is prevented
- CORS allows only authorized origins
- Secrets are not exposed in client
- Rate limiting prevents abuse

---

## Test Environment

**Frontend:** http://localhost:5000
**Backend:** http://localhost:3001
**Database:** PostgreSQL (local)
**External Services:**
- Auth0 (authentication)
- Anthropic API (AI evaluation)

---

## Testing Tools

- **Manual Testing:** Chrome DevTools, Firefox Developer Tools
- **Network Testing:** Chrome DevTools Network tab, Postman
- **Responsive Testing:** Browser DevTools device emulation
- **Performance:** Lighthouse, Chrome DevTools Performance tab
- **Database:** pgAdmin or psql CLI

---

## Issue Tracking

Issues will be documented with:
- **Issue ID**
- **Severity:** Critical / High / Medium / Low
- **Category:** UI, Functionality, Performance, Security, Data
- **Description**
- **Steps to Reproduce**
- **Expected vs Actual Behavior**
- **Screenshots/Logs**

---

## Success Criteria

Testing is considered successful when:
- ✅ All critical test cases pass
- ✅ No critical or high severity bugs remain
- ✅ Application works on Chrome, Firefox, Safari
- ✅ Mobile responsiveness is functional
- ✅ Core user journeys complete without errors
- ✅ Data integrity is maintained
- ✅ Security vulnerabilities are addressed

---

**Test Execution Date:** 2025-11-15
**Tester:** Claude (Acting as Customer/QA)
**Application Version:** Current development branch
