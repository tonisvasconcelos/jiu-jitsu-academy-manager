import React, { useRef, useState } from 'react'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  maxSize?: number // in MB
  acceptedFormats?: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Upload Photo",
  className = "",
  maxSize = 5, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`)
      }

      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPG, PNG, or GIF)')
      }

      // Convert to base64
      const base64 = await convertToBase64(file)
      onChange(base64)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleRemoveImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getInitials = (value: string) => {
    // Extract initials from a name if it's not a base64 image
    if (value && !value.startsWith('data:image')) {
      const parts = value.split(' ')
      return parts.map(part => part.charAt(0)).join('').toUpperCase()
    }
    return '📷'
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Image Preview */}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {value ? (
            <div className="relative">
              <img
                src={value}
                alt="Uploaded"
                className="h-20 w-20 rounded-full object-cover border-2 border-white/20"
                onError={() => setError('Failed to load image')}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20">
              <span className="text-white font-semibold text-xl">
                {getInitials(placeholder)}
              </span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileUpload}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              {isUploading ? 'Uploading...' : value ? 'Change Photo' : 'Upload Photo'}
            </button>
            
            <p className="text-xs text-gray-400">
              JPG, PNG or GIF (max {maxSize}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          {error}
        </div>
      )}

      {/* URL Input (Alternative) */}
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Or enter image URL:
        </label>
        <input
          type="url"
          value={value && !value.startsWith('data:image') ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 text-sm"
        />
      </div>
    </div>
  )
}

export default ImageUpload
