import React from 'react'

const Students: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Students</h2>
          <p className="text-gray-400">Manage your academy students</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add New Student
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Students Yet</h3>
            <p className="text-gray-400 mb-6">
              Start by adding your first student to the academy
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Add Your First Student
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Students
