/**
 * useShareApp Hook
 * Manages app sharing functionality across social media platforms
 */

import { useState } from 'react'

export const useShareApp = () => {
  const [showSharePopup, setShowSharePopup] = useState(false)

  const openSharePopup = () => setShowSharePopup(true)
  const closeSharePopup = () => setShowSharePopup(false)

  const copyToClipboard = () => {
    const appUrl = window.location.href
    navigator.clipboard.writeText(appUrl)
    alert('App link copied to clipboard!')
    closeSharePopup()
  }

  const shareOnSocialMedia = (platform: string) => {
    const appUrl = window.location.href
    const shareText = 'Check out Watchly - Your ultimate movie companion! Discover, save, and share your favorite movies.'

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + appUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
    }
  }

  return {
    showSharePopup,
    openSharePopup,
    closeSharePopup,
    copyToClipboard,
    shareOnSocialMedia
  }
}
