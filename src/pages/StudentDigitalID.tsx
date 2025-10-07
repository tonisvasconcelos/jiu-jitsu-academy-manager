import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useStudents } from '../contexts/StudentContext'
import { useBranches } from '../contexts/BranchContext'
import { useStudentModalities } from '../contexts/StudentModalityContext'
import { useFightModalities } from '../contexts/FightModalityContext'

const StudentDigitalID: React.FC = () => {
  const { t } = useLanguage()
  const { students } = useStudents()
  const { branches } = useBranches()
  const { connections } = useStudentModalities()
  const { modalities: fightModalities } = useFightModalities()
  const { id } = useParams<{ id: string }>()
  
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [student, setStudent] = useState<any>(null)

  useEffect(() => {
    if (id) {
      setSelectedStudent(id)
    }
  }, [id])

  useEffect(() => {
    if (selectedStudent) {
      const foundStudent = students.find(s => s.studentId === selectedStudent)
      setStudent(foundStudent)
    }
  }, [selectedStudent, students])

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.branchId === branchId)
    return branch ? branch.name : 'Unknown Branch'
  }

  const getStudentModalities = (studentId: string) => {
    return connections.filter(c => c.studentId === studentId && c.active)
  }

  const getModalityName = (modalityId: string) => {
    const modality = fightModalities.find(m => m.modalityId === modalityId)
    return modality ? modality.name : 'Unknown Modality'
  }

  const getBeltColor = (beltLevel: string) => {
    const beltColors: { [key: string]: string } = {
      'white': 'bg-white text-black border-gray-300',
      'blue': 'bg-blue-600 text-white border-blue-700',
      'purple': 'bg-purple-600 text-white border-purple-700',
      'brown': 'bg-amber-800 text-white border-amber-900',
      'black': 'bg-black text-white border-gray-800',
      'kids-white': 'bg-white text-black border-gray-300',
      'kids-gray-white': 'bg-gray-200 text-black border-gray-400',
      'kids-gray': 'bg-gray-500 text-white border-gray-600',
      'kids-gray-black': 'bg-gray-700 text-white border-gray-800',
      'kids-yellow-white': 'bg-yellow-100 text-black border-yellow-300',
      'kids-yellow': 'bg-yellow-400 text-black border-yellow-500',
      'kids-yellow-black': 'bg-yellow-600 text-white border-yellow-700',
      'kids-orange-white': 'bg-orange-100 text-black border-orange-300',
      'kids-orange': 'bg-orange-400 text-black border-orange-500',
      'kids-orange-black': 'bg-orange-600 text-white border-orange-700',
      'kids-green-white': 'bg-green-100 text-black border-green-300',
      'kids-green': 'bg-green-400 text-black border-green-500',
      'kids-green-black': 'bg-green-600 text-white border-green-700',
      'judo-kids-white': 'bg-white text-black border-gray-300',
      'judo-kids-white-yellow': 'bg-yellow-100 text-black border-yellow-300',
      'judo-kids-yellow': 'bg-yellow-400 text-black border-yellow-500',
      'judo-kids-yellow-orange': 'bg-orange-200 text-black border-orange-400',
      'judo-kids-orange': 'bg-orange-400 text-black border-orange-500',
      'judo-kids-orange-green': 'bg-green-200 text-black border-green-400',
      'judo-kids-green': 'bg-green-400 text-black border-green-500'
    }
    return beltColors[beltLevel] || 'bg-gray-500 text-white border-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const dob = new Date(birthDate)
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  const generateQRCode = (studentId: string) => {
    // Simple QR code placeholder - in a real app, you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${studentId}`
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              to="/students"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Students
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Digital ID
            </h1>
            <p className="text-lg text-gray-300 mt-2">
              Virtual student register with health insurance card layout
            </p>
          </div>

          {/* Student Selection */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Student</h2>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.firstName} {student.lastName} - {student.documentId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  const studentModalities = getStudentModalities(student.studentId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .badge-container, .badge-container * {
            visibility: visible;
          }
          .badge-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 no-print">
          <Link
            to="/students"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Students
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Digital ID
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            Virtual student register - {student.firstName} {student.lastName}
          </p>
        </div>

        {/* Corporate Badge */}
        <div className="max-w-md mx-auto badge-container">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200">
            {/* Badge Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">OSS 365</h2>
                  <p className="text-xs text-blue-200">JIU-JITSU ACADEMY</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-200">STUDENT ID</p>
                  <p className="text-sm font-mono font-bold">{student.studentId}</p>
                </div>
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-6">
              {/* Photo and Name Section */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3 overflow-hidden border-2 border-gray-300">
                  {student.photoUrl ? (
                    <img 
                      src={student.photoUrl} 
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="text-2xl text-gray-500">
                              ${student.gender === 'female' ? '👩' : '👨'}
                            </div>
                          `
                        }
                      }}
                    />
                  ) : (
                    <div className="text-2xl text-gray-500">
                      {student.gender === 'female' ? '👩' : '👨'}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {student.firstName.toUpperCase()} {student.lastName.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600">{student.displayName}</p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Belt Level</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBeltColor(student.beltLevel)}`}>
                    {student.beltLevel.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    student.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>

              {/* Document ID */}
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Document ID</p>
                <p className="text-sm font-mono font-bold text-gray-800">{student.documentId}</p>
              </div>

              {/* Branch Information */}
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Branch</p>
                <p className="text-sm font-medium text-gray-800">{getBranchName(student.branchId)}</p>
              </div>

              {/* QR Code Section */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white border border-gray-300 rounded flex items-center justify-center mb-2">
                  <img 
                    src={generateQRCode(student.studentId)} 
                    alt="QR Code"
                    className="w-full h-full rounded"
                  />
                </div>
                <p className="text-xs text-gray-500">DIGITAL VERIFICATION</p>
              </div>
            </div>

            {/* Badge Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Issued: {new Date().toLocaleDateString()}</span>
                <span>Valid: 1 Year</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 no-print">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg"
          >
            🖨️ Print Badge
          </button>
          <button
            onClick={() => {
              // Create a download link for the badge
              const link = document.createElement('a')
              link.download = `${student.firstName}_${student.lastName}_Badge.png`
              link.href = generateQRCode(student.studentId)
              link.click()
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg"
          >
            📱 Download Badge
          </button>
          <Link
            to={`/students/registration/edit/${student.studentId}`}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg"
          >
            ✏️ Edit Student
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentDigitalID
