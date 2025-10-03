import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassCheckIns } from '../contexts/ClassCheckInContext';

const ArchivedCheckIns: React.FC = () => {
  const navigate = useNavigate();
  const { checkIns, getCheckInsByDateRange } = useClassCheckIns();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  // Get unique teachers and branches for filters
  const uniqueTeachers = Array.from(new Set(checkIns.map(checkIn => checkIn.teacherName)));
  const uniqueBranches = Array.from(new Set(checkIns.map(checkIn => checkIn.branchName)));

  // Filter check-ins based on search and filters
  const filteredCheckIns = checkIns.filter(checkIn => {
    const matchesSearch = searchTerm === '' || 
      checkIn.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkIn.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkIn.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkIn.fightModalities.some(modality => 
        modality.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDate = dateFilter === '' || checkIn.checkInDate === dateFilter;
    const matchesTeacher = teacherFilter === '' || checkIn.teacherName === teacherFilter;
    const matchesBranch = branchFilter === '' || checkIn.branchName === branchFilter;

    return matchesSearch && matchesDate && matchesTeacher && matchesBranch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setTeacherFilter('');
    setBranchFilter('');
  };

  const hasActiveFilters = searchTerm !== '' || dateFilter !== '' || teacherFilter !== '' || branchFilter !== '';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Archived Check-Ins</h1>
              <p className="mt-2 text-gray-600">
                View and manage all class check-in records and history.
              </p>
            </div>
            <button
              onClick={() => navigate('/classes/check-in/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Check-In
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Check-Ins</p>
                <p className="text-2xl font-bold text-gray-900">{checkIns.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCheckInsByDateRange(
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCheckInsByDateRange(
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. per Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checkIns.length > 0 ? Math.round(checkIns.length / Math.max(1, Math.ceil((Date.now() - new Date(checkIns[0]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 7)))) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by teacher, branch, facility, or modality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                <select
                  value={teacherFilter}
                  onChange={(e) => setTeacherFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Teachers</option>
                  {uniqueTeachers.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Branches</option>
                  {uniqueBranches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Check-Ins List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Check-In Records ({filteredCheckIns.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCheckIns.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No check-ins found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Get started by creating your first class check-in.'
                  }
                </p>
              </div>
            ) : (
              filteredCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {checkIn.teacherName}
                            </p>
                            <span className="text-sm text-gray-500">•</span>
                            <p className="text-sm text-gray-500">
                              {checkIn.branchName} - {checkIn.facilityName}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center space-x-4">
                            <p className="text-sm text-gray-500">
                              {formatDate(checkIn.checkInDate)} at {formatTime(checkIn.checkInTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {checkIn.fightModalities.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Checked In
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedCheckIns;
