'use client'

import { useState, useEffect } from 'react'
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react'
import { Button } from './button'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function ShareButtons({ url, title, description, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState(url)

  // Set full URL on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.origin + url)
    }
  }, [url])

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = description ? encodeURIComponent(description) : ''

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  // Use Web Share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Share Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
            <h4 className="font-semibold text-sm mb-3">Share this product</h4>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                aria-label="Share on Facebook"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Facebook className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-sky-50 transition-colors"
                aria-label="Share on Twitter"
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-xs text-gray-600">LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-green-50 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white fill-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
            </div>

            <div className="border-t pt-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Link2 className="h-4 w-4 text-gray-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    {copied ? 'Link copied!' : 'Copy link'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
