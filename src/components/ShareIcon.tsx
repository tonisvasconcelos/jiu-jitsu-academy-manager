import React, { useState, useRef } from 'react'
import { ClassSchedule } from '../contexts/ClassScheduleContext'
import { useBranches } from '../contexts/BranchContext'
import { useBranchFacilities } from '../contexts/BranchFacilityContext'
import { useTeachers } from '../contexts/TeacherContext'
import { useFightModalities } from '../contexts/FightModalityContext'

interface ShareIconProps {
  classData: ClassSchedule
  className?: string
}

const ShareIcon: React.FC<ShareIconProps> = ({ classData, className = "" }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { branches = [] } = useBranches()
  const { facilities = [] } = useBranchFacilities()
  const { teachers = [] } = useTeachers()
  const { modalities: fightModalities = [] } = useFightModalities()

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.branchId === branchId)?.name || 'Unknown Branch'
  }

  const getFacilityName = (facilityId: string) => {
    return facilities.find(f => f.facilityId === facilityId)?.facilityName || 'Unknown Facility'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.teacherId === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'
  }

  const getModalityNames = (modalityIds: string[]) => {
    return modalityIds.map(id => {
      const modality = fightModalities.find(m => m.modalityId === id)
      return modality?.name || 'Unknown Modality'
    }).join(', ')
  }

  const formatDaysOfWeek = (days: string[]) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    }
    return days.map(day => dayMap[day] || day).join(', ')
  }

  const generateStoryImage = async () => {
    setIsGenerating(true)
    
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size for Instagram Stories (1080x1920)
      canvas.width = 1080
      canvas.height = 1920

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(0.5, '#764ba2')
      gradient.addColorStop(1, '#f093fb')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add decorative elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 100 + 50
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Main content area with semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(60, 200, canvas.width - 120, canvas.height - 400)

      // Title
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 48px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('CLASS SCHEDULE', canvas.width / 2, 320)

      // Class name
      ctx.font = 'bold 36px Arial, sans-serif'
      ctx.fillText(classData.className, canvas.width / 2, 400)

      // Class type and categories
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(`${classData.classType.toUpperCase()} • ${classData.genderCategory.toUpperCase()} • ${classData.ageCategory.toUpperCase()}`, canvas.width / 2, 460)

      // Schedule information
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'left'
      
      let yPos = 550
      const lineHeight = 50
      const leftMargin = 120

      // Days
      ctx.fillText('📅 Days:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(formatDaysOfWeek(classData.daysOfWeek), leftMargin + 200, yPos)
      
      yPos += lineHeight
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Time
      ctx.fillText('⏰ Time:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(`${classData.startTime} - ${classData.endTime}`, leftMargin + 200, yPos)
      
      yPos += lineHeight
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Duration
      ctx.fillText('⏱️ Duration:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(`${classData.duration} minutes`, leftMargin + 200, yPos)
      
      yPos += lineHeight
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Location
      ctx.fillText('📍 Location:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(getBranchName(classData.branchId), leftMargin + 200, yPos)
      
      yPos += lineHeight
      ctx.font = '24px Arial, sans-serif'
      ctx.fillText(getFacilityName(classData.facilityId), leftMargin + 200, yPos)
      
      yPos += lineHeight
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Instructor
      ctx.fillText('👨‍🏫 Instructor:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(getTeacherName(classData.teacherId), leftMargin + 200, yPos)
      
      yPos += lineHeight
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Modalities
      ctx.fillText('🥋 Modalities:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      const modalities = getModalityNames(classData.modalityIds)
      const words = modalities.split(' ')
      let currentLine = ''
      let lineY = yPos
      
      for (const word of words) {
        const testLine = currentLine + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > 400 && currentLine !== '') {
          ctx.fillText(currentLine, leftMargin + 200, lineY)
          currentLine = word + ' '
          lineY += 30
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) {
        ctx.fillText(currentLine, leftMargin + 200, lineY)
      }
      
      yPos = lineY + 60
      ctx.font = 'bold 28px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Capacity
      ctx.fillText('👥 Capacity:', leftMargin, yPos)
      ctx.font = '24px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText(`${classData.currentEnrollment}/${classData.maxCapacity} students`, leftMargin + 200, yPos)
      
      // Price if available
      if (classData.price && classData.price > 0) {
        yPos += lineHeight
        ctx.font = 'bold 28px Arial, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('💰 Price:', leftMargin, yPos)
        ctx.font = '24px Arial, sans-serif'
        ctx.fillStyle = '#f0f0f0'
        ctx.fillText(`$${classData.price}`, leftMargin + 200, yPos)
      }

      // Footer
      ctx.font = 'bold 32px Arial, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText('Join Our Class!', canvas.width / 2, canvas.height - 150)
      
      ctx.font = '20px Arial, sans-serif'
      ctx.fillStyle = '#f0f0f0'
      ctx.fillText('Contact us for more information', canvas.width / 2, canvas.height - 100)

      setShowPreview(true)
    } catch (error) {
      console.error('Error generating story image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `class-schedule-${classData.className.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const shareToSocial = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob && navigator.share) {
        const file = new File([blob], `class-schedule-${classData.className}.png`, { type: 'image/png' })
        navigator.share({
          title: `Class Schedule: ${classData.className}`,
          text: `Check out this class schedule: ${classData.className}`,
          files: [file]
        }).catch(console.error)
      } else {
        // Fallback to download
        downloadImage()
      }
    })
  }

  return (
    <>
      <button
        onClick={generateStoryImage}
        disabled={isGenerating}
        className={`p-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none ${className}`}
        title="Share as Instagram Story"
      >
        {isGenerating ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        )}
      </button>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Story Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <canvas
                ref={canvasRef}
                className="w-full h-auto border border-gray-200 rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadImage}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Download
              </button>
              <button
                onClick={shareToSocial}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ShareIcon
