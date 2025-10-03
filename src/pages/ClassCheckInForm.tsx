import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassSchedules } from '../contexts/ClassScheduleContext';
import { useClassCheckIns } from '../contexts/ClassCheckInContext';
import { useTeachers } from '../contexts/TeacherContext';
import { useBranches } from '../contexts/BranchContext';
import { useBranchFacilities } from '../contexts/BranchFacilityContext';
import { useFightModalities } from '../contexts/FightModalityContext';
import { useStudents } from '../contexts/StudentContext';

const ClassCheckInForm: React.FC = () => {
  const navigate = useNavigate();
  const { classes } = useClassSchedules();
  const { addCheckIn } = useClassCheckIns();
  const { teachers = [] } = useTeachers();
  const { branches = [] } = useBranches();
  const { facilities = [] } = useBranchFacilities();
  const { modalities: fightModalities = [] } = useFightModalities();
  const { students = [] } = useStudents();

  const [formData, setFormData] = useState({
    classId: '',
    studentId: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkInTime: new Date().toTimeString().slice(0, 5),
  });

  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Get available classes for the selected date
  const getAvailableClasses = () => {
    if (!formData.checkInDate) return [];
    
    const selectedDate = new Date(formData.checkInDate);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    return classes.filter(cls => 
      cls.daysOfWeek.includes(dayOfWeek as any) && 
      cls.status === 'active'
    );
  };

  // Update selected class when classId changes
  useEffect(() => {
    if (formData.classId) {
      const classData = classes.find(cls => cls.classId === formData.classId);
      setSelectedClass(classData);
    } else {
      setSelectedClass(null);
    }
  }, [formData.classId, classes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    if (!formData.studentId) {
      alert('Please select a student');
      return;
    }

    // Get teacher name
    const teacher = teachers.find(t => t.id === selectedClass.teacherId);
    const teacherName = teacher ? teacher.name : 'Unknown Teacher';

    // Get branch name
    const branch = branches.find(b => b.id === selectedClass.branchId);
    const branchName = branch ? branch.name : 'Unknown Branch';

    // Get facility name
    const facility = facilities.find(f => f.id === selectedClass.facilityId);
    const facilityName = facility ? facility.name : 'Unknown Facility';

    // Get fight modality names
    const modalityNames = selectedClass.modalityIds
      .map((modalityId: string) => {
        const modality = fightModalities.find(m => m.id === modalityId);
        return modality ? modality.name : 'Unknown Modality';
      });

    // Get student name
    const student = students.find(s => s.id === formData.studentId);
    const studentName = student ? `${student.name} ${student.lastName}` : 'Unknown Student';

    // Create check-in record
    addCheckIn({
      classId: selectedClass.classId,
      studentId: formData.studentId,
      studentName,
      checkInDate: formData.checkInDate,
      checkInTime: formData.checkInTime,
      teacherName,
      branchName,
      facilityName,
      fightModalities: modalityNames,
    });

    alert('Check-in recorded successfully!');
    navigate('/classes/check-in');
  };

  const availableClasses = getAvailableClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white">Class Check-In</h1>
            <p className="mt-1 text-sm text-gray-300">
              Record a class check-in to track class history and attendance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Date Selection */}
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-300">
                Check-In Date *
              </label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                required
              />
            </div>

            {/* Time Selection */}
            <div>
              <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-300">
                Check-In Time *
              </label>
              <input
                type="time"
                id="checkInTime"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                required
              />
            </div>

            {/* Class Selection */}
            <div>
              <label htmlFor="classId" className="block text-sm font-medium text-gray-300">
                Select Class *
              </label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                required
              >
                <option value="">Choose a class...</option>
                {availableClasses.map((cls) => (
                  <option key={cls.classId} value={cls.classId} className="bg-gray-800 text-white">
                    {cls.className} - {cls.startTime} to {cls.endTime}
                  </option>
                ))}
              </select>
              {formData.checkInDate && availableClasses.length === 0 && (
                <p className="mt-1 text-sm text-gray-400">
                  No classes available for the selected date.
                </p>
              )}
            </div>

            {/* Student Selection */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-300">
                Select Student *
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                required
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id} className="bg-gray-800 text-white">
                    {student.name} {student.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Details Display */}
            {selectedClass && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Class Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-300">Class Name:</span>
                    <p className="text-sm text-white">{selectedClass.className}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300">Time:</span>
                    <p className="text-sm text-white">{selectedClass.startTime} - {selectedClass.endTime}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300">Teacher:</span>
                    <p className="text-sm text-white">
                      {teachers.find(t => t.id === selectedClass.teacherId)?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300">Branch:</span>
                    <p className="text-sm text-white">
                      {branches.find(b => b.id === selectedClass.branchId)?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300">Facility:</span>
                    <p className="text-sm text-white">
                      {facilities.find(f => f.id === selectedClass.facilityId)?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-300">Fight Modalities:</span>
                    <p className="text-sm text-white">
                      {selectedClass.modalityIds
                        .map((modalityId: string) => {
                          const modality = fightModalities.find(m => m.id === modalityId);
                          return modality ? modality.name : 'Unknown';
                        })
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/classes/check-in')}
                className="px-4 py-2 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedClass || !formData.studentId}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check-In Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassCheckInForm;
