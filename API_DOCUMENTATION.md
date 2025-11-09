# PromptMaster Executive - API Documentation

## Overview

This document describes the REST API endpoints for the PromptMaster Executive backend service. All endpoints require authentication via Auth0 JWT tokens unless explicitly marked as public.

**Base URL**: `http://localhost:5000/api` (development) or `https://api.promptmaster.ai/api` (production)

**Authentication**: Bearer token in Authorization header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Scenarios](#scenarios)
4. [Evaluation](#evaluation)
5. [Progress & Stats](#progress--stats)
6. [Achievements](#achievements)
7. [Certificates](#certificates)
8. [Error Responses](#error-responses)

---

## Authentication

### User Registration/Login
Auth0 handles authentication. No custom endpoints needed.

**Auth0 Configuration**:
- Domain: `your-domain.us.auth0.com`
- Client ID: `your-client-id`
- Audience: `https://api.promptmaster.ai`

---

## User Management

### Get Current User Profile
Retrieve the authenticated user's profile.

**Endpoint**: `GET /api/user/profile`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "auth0|123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://...",
    "created_at": "2024-01-01T00:00:00Z",
    "onboarding_completed": true,
    "user_metadata": {
      "role": "Executive",
      "company": "Acme Corp",
      "goals": ["Improve AI skills", "Get certified"]
    }
  }
}
```

### Update User Profile
Update user metadata and preferences.

**Endpoint**: `PUT /api/user/profile`

**Request Body**:
```json
{
  "user_metadata": {
    "role": "Manager",
    "company": "New Company Inc",
    "goals": ["Master prompt engineering"]
  },
  "onboarding_completed": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## Scenarios

### List All Scenarios
Get all available scenarios grouped by module.

**Endpoint**: `GET /api/scenarios`

**Query Parameters**:
- `module` (optional): Filter by module ID (1-4)
- `difficulty` (optional): Filter by difficulty (beginner, intermediate, advanced, expert)

**Response** (200 OK):
```json
{
  "success": true,
  "scenarios": [
    {
      "id": 1,
      "title": "Customer Email Response",
      "description": "Craft a professional response to a customer inquiry",
      "module_id": 1,
      "module_name": "Foundation",
      "difficulty": "beginner",
      "estimated_time": 10,
      "objectives": [
        "Use clear and professional language",
        "Address customer concerns directly"
      ],
      "is_locked": false,
      "user_completed": false,
      "best_score": null
    }
  ],
  "total": 50,
  "modules": [
    {
      "id": 1,
      "name": "Foundation",
      "total_scenarios": 10,
      "completed_scenarios": 0
    }
  ]
}
```

### Get Scenario Details
Get full details for a specific scenario including context and instructions.

**Endpoint**: `GET /api/scenarios/:scenarioId`

**Response** (200 OK):
```json
{
  "success": true,
  "scenario": {
    "id": 1,
    "title": "Customer Email Response",
    "description": "Craft a professional response to a customer inquiry",
    "module_id": 1,
    "difficulty": "beginner",
    "estimated_time": 10,
    "business_context": "You are the customer service manager at...",
    "task": "Write a prompt that will generate...",
    "supporting_documents": [
      {
        "title": "Customer Email",
        "content": "..."
      }
    ],
    "evaluation_criteria": [
      {
        "name": "Clarity",
        "description": "Prompt is clear and unambiguous",
        "weight": 25
      },
      {
        "name": "Specificity",
        "description": "Includes specific requirements",
        "weight": 25
      },
      {
        "name": "Context",
        "description": "Provides necessary background",
        "weight": 25
      },
      {
        "name": "Format",
        "description": "Specifies desired output format",
        "weight": 25
      }
    ],
    "hints": [
      "Include the customer's name",
      "Specify the tone (professional, friendly)"
    ],
    "user_attempts": 0,
    "best_score": null
  }
}
```

---

## Evaluation

### Submit Prompt for Evaluation
Submit a user's prompt for AI evaluation.

**Endpoint**: `POST /api/evaluate`

**Request Body**:
```json
{
  "scenario_id": 1,
  "prompt": "Write a professional email response to...",
  "time_spent": 600
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "attempt": {
    "id": 12345,
    "scenario_id": 1,
    "user_id": "auth0|123",
    "score": 85,
    "created_at": "2024-01-15T10:30:00Z",
    "criteria_scores": [
      {
        "name": "Clarity",
        "score": 90,
        "max_score": 100,
        "feedback": "Well structured and easy to understand"
      },
      {
        "name": "Specificity",
        "score": 85,
        "max_score": 100,
        "feedback": "Good level of detail"
      },
      {
        "name": "Context",
        "score": 80,
        "max_score": 100,
        "feedback": "Could provide more background"
      },
      {
        "name": "Format",
        "score": 85,
        "max_score": 100,
        "feedback": "Clear format specification"
      }
    ],
    "strengths": [
      "Clear and professional tone",
      "Specific output requirements",
      "Good use of examples"
    ],
    "improvements": [
      "Add more context about the customer",
      "Specify response length",
      "Include tone guidelines"
    ],
    "rewrite_example": "Improved version of the prompt...",
    "key_takeaway": "Always include context, specificity, and format requirements for best results."
  },
  "points_awarded": 125,
  "level_up": false,
  "new_achievements": []
}
```

### Get Attempt History
Get all attempts for a specific scenario.

**Endpoint**: `GET /api/scenarios/:scenarioId/attempts`

**Response** (200 OK):
```json
{
  "success": true,
  "attempts": [
    {
      "id": 123,
      "score": 85,
      "created_at": "2024-01-15T10:30:00Z",
      "time_spent": 600
    }
  ],
  "total_attempts": 1,
  "best_score": 85
}
```

---

## Progress & Stats

### Get User Progress
Retrieve comprehensive progress data for the authenticated user.

**Endpoint**: `GET /api/progress`

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "totalPoints": 2450,
    "currentLevel": 5,
    "currentStreak": 12,
    "longestStreak": 15
  },
  "progress": {
    "scenariosCompleted": 18,
    "totalScenarios": 50,
    "completionRate": 36,
    "averageScore": 82,
    "totalTimeSpent": 10800,
    "moduleProgress": [
      {
        "moduleId": 1,
        "moduleName": "Foundation",
        "totalScenarios": 10,
        "scenariosCompleted": 10,
        "averageScore": 88,
        "isLocked": false
      },
      {
        "moduleId": 2,
        "moduleName": "Intermediate",
        "totalScenarios": 15,
        "scenariosCompleted": 8,
        "averageScore": 79,
        "isLocked": false
      }
    ],
    "skillScores": {
      "clarity": 85,
      "context": 78,
      "specificity": 90,
      "format": 75,
      "businessValue": 80,
      "innovation": 70
    },
    "recentActivity": [
      {
        "id": 1,
        "type": "scenario_completed",
        "scenarioTitle": "Customer Email Response",
        "score": 85,
        "timestamp": "2024-01-15T10:30:00Z",
        "icon": "✅",
        "message": "Completed 'Customer Email Response'"
      },
      {
        "id": 2,
        "type": "achievement_earned",
        "badgeName": "Week Warrior",
        "timestamp": "2024-01-14T08:00:00Z",
        "icon": "🏆",
        "message": "Unlocked 'Week Warrior' badge"
      }
    ]
  }
}
```

### Get Leaderboard
Get top users ranked by total points.

**Endpoint**: `GET /api/leaderboard`

**Query Parameters**:
- `limit` (optional, default: 50): Number of users to return
- `offset` (optional, default: 0): Pagination offset

**Response** (200 OK):
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "auth0|123",
      "name": "John Doe",
      "picture": "https://...",
      "total_points": 12500,
      "level": 25,
      "scenarios_completed": 50,
      "average_score": 92
    }
  ],
  "total_users": 1000,
  "current_user_rank": 45
}
```

---

## Achievements

### Get User Achievements
Retrieve all achievements with unlock status.

**Endpoint**: `GET /api/achievements`

**Response** (200 OK):
```json
{
  "success": true,
  "achievements": [
    {
      "id": 1,
      "badge_name": "First Steps",
      "badge_description": "Complete your first scenario",
      "icon": "🎯",
      "unlock_criteria": "Complete 1 scenario",
      "earned": true,
      "earned_at": "2024-01-10T14:30:00Z"
    },
    {
      "id": 2,
      "badge_name": "Week Warrior",
      "badge_description": "Maintain a 7-day streak",
      "icon": "🔥",
      "unlock_criteria": "7-day streak",
      "earned": true,
      "earned_at": "2024-01-14T08:00:00Z"
    },
    {
      "id": 3,
      "badge_name": "Quality Master",
      "badge_description": "Score 90%+ on 10 scenarios",
      "icon": "💎",
      "unlock_criteria": "10 scenarios with 90%+ score",
      "earned": false,
      "earned_at": null,
      "progress": {
        "current": 3,
        "required": 10
      }
    }
  ],
  "total_earned": 2,
  "total_available": 10
}
```

---

## Certificates

### Check Certificate Eligibility
Check if user is eligible for certificate.

**Endpoint**: `GET /api/certificate/eligibility`

**Response** (200 OK):
```json
{
  "success": true,
  "eligible": false,
  "requirements": {
    "scenariosCompleted": {
      "required": 50,
      "current": 18,
      "met": false
    },
    "averageScore": {
      "required": 70,
      "current": 82,
      "met": true
    },
    "capstoneCompleted": {
      "required": true,
      "current": false,
      "met": false
    }
  }
}
```

### Generate Certificate
Generate a new certificate for eligible user.

**Endpoint**: `POST /api/certificate/generate`

**Request Body**:
```json
{
  "user_name": "John Doe",
  "final_score": 85
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "certificate": {
    "id": "CERT-20240115-ABC123",
    "user_id": "auth0|123",
    "user_name": "John Doe",
    "course_name": "PromptMaster Executive",
    "issue_date": "2024-01-15T10:00:00Z",
    "final_score": 85,
    "total_hours": 30,
    "scenarios_completed": 50,
    "skills": [
      "Clarity & Structure",
      "Context Setting",
      "Specificity",
      "Format Instructions",
      "Business Value",
      "Innovation"
    ],
    "verification_url": "https://promptmaster.ai/verify/CERT-20240115-ABC123",
    "pdf_url": "https://cdn.promptmaster.ai/certificates/CERT-20240115-ABC123.pdf"
  }
}
```

### Verify Certificate (Public)
Publicly verify a certificate's authenticity.

**Endpoint**: `GET /api/certificate/verify/:certificateId`

**Authentication**: None required (public endpoint)

**Response** (200 OK):
```json
{
  "success": true,
  "valid": true,
  "certificate": {
    "id": "CERT-20240115-ABC123",
    "user_name": "John Doe",
    "course_name": "PromptMaster Executive",
    "issue_date": "2024-01-15T10:00:00Z",
    "final_score": 85,
    "verified": true
  }
}
```

**Response** (404 Not Found):
```json
{
  "success": true,
  "valid": false,
  "message": "Certificate not found or has been revoked"
}
```

### Download Certificate
Download certificate as PDF.

**Endpoint**: `GET /api/certificate/:certificateId/download`

**Response**: PDF file download

---

## Error Responses

### Error Format
All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks permission for this action
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation failed
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service temporarily unavailable

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `SCENARIO_LOCKED` | Scenario is locked (prerequisites not met) |
| `INVALID_SCENARIO` | Scenario ID does not exist |
| `VALIDATION_ERROR` | Request validation failed |
| `EVALUATION_FAILED` | AI evaluation service failed |
| `NOT_ELIGIBLE` | User not eligible for certificate |
| `CERTIFICATE_EXISTS` | Certificate already generated |
| `RATE_LIMIT` | Too many requests |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "SCENARIO_LOCKED",
    "message": "This scenario is locked. Complete all Foundation scenarios first.",
    "details": {
      "scenario_id": 15,
      "required_scenarios": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "completed_scenarios": [1, 2, 3]
    }
  }
}
```

---

## Rate Limits

- **General endpoints**: 100 requests per minute
- **Evaluation endpoint**: 30 requests per minute
- **Certificate generation**: 5 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705320000
```

---

## Webhooks (Future)

Coming soon: Webhook notifications for events like achievement unlocks, certificate generation, etc.

---

## SDK Examples

### JavaScript/Node.js

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.promptmaster.ai/api',
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
})

// Submit prompt for evaluation
const result = await api.post('/evaluate', {
  scenario_id: 1,
  prompt: 'Write a professional email...',
  time_spent: 600
})

console.log(result.data.attempt.score)
```

### Python

```python
import requests

headers = {
    'Authorization': f'Bearer {auth_token}'
}

# Get user progress
response = requests.get(
    'https://api.promptmaster.ai/api/progress',
    headers=headers
)

progress = response.json()
print(f"Completed: {progress['progress']['scenariosCompleted']}/50")
```

---

## Support

For API support or questions:
- Email: api-support@promptmaster.ai
- Documentation: https://docs.promptmaster.ai
- Status Page: https://status.promptmaster.ai

---

**Last Updated**: January 2024
**API Version**: 1.0.0
