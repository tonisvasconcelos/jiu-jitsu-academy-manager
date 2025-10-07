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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
            Virtual student register - {student.firstName} {student.lastName}
          </p>
        </div>

        {/* Digital ID Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">OSS 365</h2>
                <p className="text-blue-100">Jiu-Jitsu Academy</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Student ID</p>
                <p className="text-lg font-mono font-bold">{student.studentId}</p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Photo and Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    {student.photoUrl ? (
                      <img 
                        src={student.photoUrl} 
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-gray-500">
                        {student.gender === 'female' ? '👩' : '👨'}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-gray-600">{student.displayName}</p>
                </div>

                {/* QR Code */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <img 
                      src={generateQRCode(student.studentId)} 
                      alt="QR Code"
                      className="w-full h-full rounded"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Digital Verification</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-800 font-medium">{student.firstName} {student.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Document ID</label>
                        <p className="text-gray-800 font-mono">{student.documentId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                        <p className="text-gray-800">{formatDate(student.birthDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Age</label>
                        <p className="text-gray-800">{calculateAge(student.birthDate)} years old</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Gender</label>
                        <p className="text-gray-800 capitalize">{student.gender}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academy Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Academy Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Branch</label>
                        <p className="text-gray-800">{getBranchName(student.branchId)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Student Type</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isKidsStudent 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {student.isKidsStudent ? 'Kids Student' : 'Adult Student'}
                        </span>
                      </div>
                      {student.weight && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Weight</label>
                          <p className="text-gray-800">{student.weight} kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Belt Level */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Current Belt Level
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-lg border-2 ${getBeltColor(student.beltLevel)}`}>
                      <span className="font-bold capitalize">
                        {student.beltLevel.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Training Modalities */}
                {studentModalities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Training Modalities
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentModalities.map((connection) => (
                        <div key={connection.connectionId} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">
                              {getModalityName(connection.modalityId)}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              connection.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {connection.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Started: {formatDate(connection.assignmentDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800">{student.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-800">{student.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <p>Generated on: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p>Valid until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            🖨️ Print ID Card
          </button>
          <button
            onClick={() => {
              const cardElement = document.querySelector('.bg-white.rounded-2xl')
              if (cardElement) {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                // Simple download functionality - in a real app, you'd use html2canvas
                const link = document.createElement('a')
                link.download = `${student.firstName}_${student.lastName}_DigitalID.png`
                link.href = generateQRCode(student.studentId)
                link.click()
              }
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            📱 Download ID Card
          </button>
          <Link
            to={`/students/registration/edit/${student.studentId}`}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            ✏️ Edit Student
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentDigitalID
