'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

interface ThankYouModalProps {
  name: string
  amount: number
  onClose: () => void
}

interface ModalSettings {
  modalContent: {
    title: string
    description: string
    impactMessages: {
      high: string
      medium: string
      low: string
    }
    shareText: string
    closeButtonText: string
  }
  designSettings: {
    primaryColor: string
    successColor: string
    backgroundColor: string
    textColor: string
    borderRadius: string
    showConfetti: boolean
    confettiColors: string[]
    animationDuration: number
    modalSize: string
  }
  behaviorSettings: {
    autoClose: boolean
    autoCloseDelay: number
    showShareButtons: boolean
    enableSocialSharing: boolean
    showImpactSection: boolean
    enablePersonalization: boolean
    trackingEnabled: boolean
    showAnimation: boolean
  }
  socialSettings: {
    facebook: {
      enabled: boolean
      shareText: string
    }
    twitter: {
      enabled: boolean
      shareText: string
    }
    email: {
      enabled: boolean
      subject: string
      body: string
    }
  }
  impactThresholds: {
    high: number
    medium: number
    mealCost: number
  }
}

const defaultSettings: ModalSettings = {
  modalContent: {
    title: "Thank You",
    description: "Your donation will make a real difference in someone's life.",
    impactMessages: {
      high: "Your generous donation will help build clean water facilities for communities in need.",
      medium: "Your donation will support a child's education for a full month.",
      low: "Your donation will provide meals for children."
    },
    shareText: "Share your contribution",
    closeButtonText: "Close"
  },
  designSettings: {
    primaryColor: "#8B5CF6",
    successColor: "#10B981",
    backgroundColor: "#FFFFFF",
    textColor: "#374151",
    borderRadius: "16px",
    showConfetti: true,
    confettiColors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
    animationDuration: 300,
    modalSize: "md"
  },
  behaviorSettings: {
    autoClose: false,
    autoCloseDelay: 5000,
    showShareButtons: true,
    enableSocialSharing: true,
    showImpactSection: true,
    enablePersonalization: true,
    trackingEnabled: false,
    showAnimation: true
  },
  socialSettings: {
    facebook: {
      enabled: true,
      shareText: "I just made a donation to help those in need!"
    },
    twitter: {
      enabled: true,
      shareText: "I just made a donation to help those in need! #Donation #MakeADifference"
    },
    email: {
      enabled: true,
      subject: "Join me in making a difference",
      body: "I just made a donation to help those in need. Join me in making a difference!"
    }
  },
  impactThresholds: {
    high: 5000,
    medium: 1000,
    mealCost: 50
  }
}

export default function ThankYouModal({ name, amount, onClose }: ThankYouModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState<ModalSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModalSettings()
  }, [])

  useEffect(() => {
    if (!loading) {
      // Create confetti effect if enabled
      if (settings.designSettings.showConfetti && confettiRef.current) {
        createConfetti()
      }

      // Auto close if enabled
      if (settings.behaviorSettings.autoClose) {
        const timer = setTimeout(() => {
          onClose()
        }, settings.behaviorSettings.autoCloseDelay)
        
        return () => clearTimeout(timer)
      }

      // Lock body scroll
      document.body.style.overflow = 'hidden'

      // Cleanup function
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [loading, settings, onClose])

  const fetchModalSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dthanks')
      if (response.ok) {
        const data = await response.json()
        setSettings(data || defaultSettings)
      } else {
        console.warn('Failed to fetch modal settings, using defaults')
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error fetching modal settings:', error)
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  // Create confetti animation
  const createConfetti = () => {
    const container = confettiRef.current
    if (!container) return

    const colors = settings.designSettings.confettiColors
    const totalConfetti = 100

    for (let i = 0; i < totalConfetti; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'absolute w-2 h-2 rounded-full'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.top = '50%'
      confetti.style.left = '50%'
      container.appendChild(confetti)

      // Animate each confetti piece
      gsap.to(confetti, {
        x: `${Math.random() * 600 - 300}`,
        y: `${Math.random() * 600 - 300}`,
        scale: Math.random() * 1 + 0.5,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: Math.random() * 1 + 1,
        ease: 'power3.out',
        onComplete: () => {
          confetti.remove()
        }
      })
    }
  }

  const getImpactMessage = () => {
    const { impactThresholds, modalContent } = settings
    
    if (amount >= impactThresholds.high) {
      return modalContent.impactMessages.high
    } else if (amount >= impactThresholds.medium) {
      return modalContent.impactMessages.medium
    } else {
      const meals = Math.floor(amount / impactThresholds.mealCost)
      return modalContent.impactMessages.low.replace('children', `${meals} children`)
    }
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'email') => {
    const { socialSettings } = settings
    const shareText = socialSettings[platform].shareText || socialSettings[platform].subject
    
    switch (platform) {
      case 'facebook':
        if (socialSettings.facebook.enabled) {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, '_blank')
        }
        break
      case 'twitter':
        if (socialSettings.twitter.enabled) {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
        }
        break
      case 'email':
        if (socialSettings.email.enabled) {
          window.location.href = `mailto:?subject=${encodeURIComponent(socialSettings.email.subject)}&body=${encodeURIComponent(socialSettings.email.body)}`
        }
        break
    }

    // Track sharing if enabled
    if (settings.behaviorSettings.trackingEnabled) {
      // Add your tracking logic here
      console.log(`Shared on ${platform}`)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const modalSizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Confetti container */}
      {settings.designSettings.showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-10" />
      )}

      <motion.div
        ref={modalRef}
        className={`rounded-2xl p-6 md:p-10 ${modalSizeClasses[settings.designSettings.modalSize as keyof typeof modalSizeClasses] || 'max-w-md'} w-full relative z-20`}
        style={{
          backgroundColor: settings.designSettings.backgroundColor,
          borderRadius: settings.designSettings.borderRadius,
          color: settings.designSettings.textColor
        }}
        initial={settings.behaviorSettings.showAnimation ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={settings.behaviorSettings.showAnimation ? { scale: 0.8, opacity: 0 } : { opacity: 0 }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 300,
          duration: settings.designSettings.animationDuration / 1000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <motion.div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              backgroundColor: `${settings.designSettings.successColor}20`,
              color: settings.designSettings.successColor
            }}
            initial={settings.behaviorSettings.showAnimation ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-2"
            initial={settings.behaviorSettings.showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {settings.modalContent.title}
            {settings.behaviorSettings.enablePersonalization && name ? `, ${name}` : ''}!
          </motion.h2>

          <motion.p
            className="mb-6"
            style={{ color: `${settings.designSettings.textColor}80` }}
            initial={settings.behaviorSettings.showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your donation of <span className="font-bold">₹{amount.toLocaleString()}</span> {settings.modalContent.description}
          </motion.p>

          {settings.behaviorSettings.showImpactSection && (
            <motion.div
              className="border rounded-lg p-4 mb-6"
              style={{
                backgroundColor: `${settings.designSettings.primaryColor}10`,
                borderColor: `${settings.designSettings.primaryColor}20`
              }}
              initial={settings.behaviorSettings.showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-medium" style={{ color: settings.designSettings.primaryColor }}>
                Your Impact
              </p>
              <p className="text-sm mt-1" style={{ color: `${settings.designSettings.textColor}80` }}>
                {getImpactMessage()}
              </p>
            </motion.div>
          )}

          {settings.behaviorSettings.showShareButtons && settings.behaviorSettings.enableSocialSharing && (
            <motion.div
              className="space-y-3 mb-6"
              initial={settings.behaviorSettings.showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm" style={{ color: `${settings.designSettings.textColor}80` }}>
                {settings.modalContent.shareText}
              </p>
              <div className="flex justify-center space-x-4">
                {settings.socialSettings.facebook.enabled && (
                  <button 
                    onClick={() => handleSocialShare('facebook')}
                    className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </button>
                )}
                {settings.socialSettings.twitter.enabled && (
                  <button 
                    onClick={() => handleSocialShare('twitter')}
                    className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </button>
                )}
                {settings.socialSettings.email.enabled && (
                  <button 
                    onClick={() => handleSocialShare('email')}
                    className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <motion.button
            className="px-6 py-3 rounded-lg font-medium transition duration-300 w-full text-white"
            style={{
              backgroundColor: settings.designSettings.primaryColor,
              borderRadius: settings.designSettings.borderRadius
            }}
            initial={settings.behaviorSettings.showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {settings.modalContent.closeButtonText}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}