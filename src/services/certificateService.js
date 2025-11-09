import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

/**
 * Check if user is eligible for certificate
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Eligibility status
 */
export const checkCertificateEligibility = async (userId, token) => {
  setAuthToken(token)

  try {
    const response = await api.get(`/certificate/eligibility/${userId}`)
    return {
      success: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error checking certificate eligibility:', error)

    return {
      success: false,
      eligible: false,
      error: error.response?.data?.error || 'Failed to check eligibility'
    }
  }
}

/**
 * Generate and issue certificate
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Certificate data with PDF URL
 */
export const generateCertificate = async (userId, token) => {
  setAuthToken(token)

  try {
    const response = await api.post('/certificate/generate', { userId })
    return {
      success: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error generating certificate:', error)

    return {
      success: false,
      error: error.response?.data?.error || 'Failed to generate certificate'
    }
  }
}

/**
 * Verify a certificate by ID
 * @param {string} certificateId - Certificate ID
 * @returns {Promise<Object>} Certificate verification data
 */
export const verifyCertificate = async (certificateId) => {
  try {
    const response = await api.get(`/certificate/verify/${certificateId}`)
    return {
      success: true,
      valid: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error verifying certificate:', error)

    return {
      success: false,
      valid: false,
      error: error.response?.data?.error || 'Certificate not found'
    }
  }
}

/**
 * Get user's certificate if they have one
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Certificate data
 */
export const getUserCertificate = async (userId, token) => {
  setAuthToken(token)

  try {
    const response = await api.get(`/certificate/user/${userId}`)
    return {
      success: true,
      ...response.data
    }
  } catch (error) {
    console.error('Error fetching user certificate:', error)

    return {
      success: false,
      hasCertificate: false,
      error: error.response?.data?.error || 'No certificate found'
    }
  }
}

/**
 * Mock certificate eligibility check
 */
export const mockCheckCertificateEligibility = async (userId, progress) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenariosCompleted = progress?.scenariosCompleted || 0
      const averageScore = progress?.averageScore || 0
      const totalScenarios = progress?.totalScenarios || 50

      const requirements = {
        scenariosCompleted: {
          required: totalScenarios,
          current: scenariosCompleted,
          met: scenariosCompleted >= totalScenarios
        },
        averageScore: {
          required: 70,
          current: averageScore,
          met: averageScore >= 70
        },
        capstoneCompleted: {
          required: true,
          current: scenariosCompleted >= totalScenarios,
          met: scenariosCompleted >= totalScenarios
        }
      }

      const eligible = requirements.scenariosCompleted.met &&
                      requirements.averageScore.met &&
                      requirements.capstoneCompleted.met

      resolve({
        success: true,
        eligible,
        requirements,
        message: eligible
          ? 'Congratulations! You are eligible to receive your certificate.'
          : 'Complete all requirements to earn your certificate.'
      })
    }, 300)
  })
}

/**
 * Mock certificate generation
 */
export const mockGenerateCertificate = async (userId, userName, finalScore) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const certificateId = `CERT-${userId}-${Date.now()}`
      const issueDate = new Date().toISOString()

      resolve({
        success: true,
        certificate: {
          id: certificateId,
          userId,
          userName,
          issueDate,
          finalScore,
          certificateUrl: `/certificates/${certificateId}.pdf`, // Would be actual PDF URL
          verificationUrl: `/verify/${certificateId}`,
          linkedInBadgeUrl: `/certificates/${certificateId}-linkedin.png`,
          shareImageUrl: `/certificates/${certificateId}-share.png`
        },
        message: 'Certificate generated successfully!'
      })
    }, 2000)
  })
}

/**
 * Mock certificate verification
 */
export const mockVerifyCertificate = async (certificateId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate valid certificate
      const isValid = certificateId.startsWith('CERT-')

      if (isValid) {
        resolve({
          success: true,
          valid: true,
          certificate: {
            id: certificateId,
            userName: 'John Doe',
            issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            finalScore: 87,
            courseName: 'PromptMaster Executive - AI Prompt Engineering',
            organization: 'PromptMaster',
            verified: true
          }
        })
      } else {
        resolve({
          success: false,
          valid: false,
          error: 'Invalid certificate ID'
        })
      }
    }, 500)
  })
}

/**
 * Generate certificate data for display
 */
export const generateCertificateData = (userName, userId, finalScore, issueDate) => {
  const certificateId = `CERT-${userId}-${Date.now()}`

  return {
    id: certificateId,
    userName,
    userId,
    courseName: 'PromptMaster Executive',
    courseFullName: 'Professional AI Prompt Engineering Certification',
    organization: 'PromptMaster',
    issueDate: issueDate || new Date().toISOString(),
    finalScore,
    completionDate: new Date().toISOString(),
    scenariosCompleted: 50,
    totalHours: 25,
    verificationUrl: `${window.location.origin}/verify/${certificateId}`,
    skills: [
      'Advanced Prompt Engineering',
      'Business Application of AI',
      'Strategic Prompt Design',
      'Quality Assurance & Testing',
      'Template Development',
      'Ethical AI Usage'
    ],
    certificateNumber: certificateId.split('-').pop(),
    signatoryName: 'PromptMaster Team',
    signatoryTitle: 'Chief Learning Officer'
  }
}

/**
 * Format date for certificate display
 */
export const formatCertificateDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Download certificate as image (simulated)
 */
export const downloadCertificate = async (certificateId, format = 'pdf') => {
  // In production, this would trigger actual PDF download
  console.log(`Downloading certificate ${certificateId} as ${format}`)

  // Simulate download
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Certificate downloaded as ${format.toUpperCase()}`
      })
    }, 1000)
  })
}

/**
 * Share certificate to social media
 */
export const shareCertificate = (certificateId, platform) => {
  const shareUrl = `${window.location.origin}/verify/${certificateId}`
  const text = encodeURIComponent('I just earned my Professional AI Prompt Engineering Certification from PromptMaster! 🎓')

  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }
}

export default {
  checkCertificateEligibility,
  generateCertificate,
  verifyCertificate,
  getUserCertificate,
  mockCheckCertificateEligibility,
  mockGenerateCertificate,
  mockVerifyCertificate,
  generateCertificateData,
  formatCertificateDate,
  downloadCertificate,
  shareCertificate
}
