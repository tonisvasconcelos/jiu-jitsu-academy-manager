import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ClassCheckIn {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  checkInDate: string; // YYYY-MM-DD format
  checkInTime: string; // HH:MM format
  teacherName: string;
  branchName: string;
  facilityName: string;
  fightModalities: string[];
  createdAt: string;
}

interface ClassCheckInContextType {
  checkIns: ClassCheckIn[];
  addCheckIn: (checkIn: Omit<ClassCheckIn, 'id' | 'createdAt'>) => void;
  getCheckInsByDate: (date: string) => ClassCheckIn[];
  getCheckInsByClass: (classId: string) => ClassCheckIn[];
  getCheckInsByDateRange: (startDate: string, endDate: string) => ClassCheckIn[];
  getCheckInsByStudentAndModality: (studentId: string, modalityName: string, startDate: string, endDate: string) => ClassCheckIn[];
  getTotalCheckIns: () => number;
  getCheckInsThisWeek: () => number;
  getCheckInsThisMonth: () => number;
  getAverageCheckInsPerWeek: () => number;
}

const ClassCheckInContext = createContext<ClassCheckInContextType | undefined>(undefined);

export const useClassCheckIns = () => {
  const context = useContext(ClassCheckInContext);
  if (!context) {
    throw new Error('useClassCheckIns must be used within a ClassCheckInProvider');
  }
  return context;
};

interface ClassCheckInProviderProps {
  children: ReactNode;
}

export const ClassCheckInProvider: React.FC<ClassCheckInProviderProps> = ({ children }) => {
  const [checkIns, setCheckIns] = useState<ClassCheckIn[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCheckIns = localStorage.getItem('classCheckIns');
    if (savedCheckIns) {
      try {
        setCheckIns(JSON.parse(savedCheckIns));
      } catch (error) {
        console.error('Error loading class check-ins from localStorage:', error);
        setCheckIns([]);
      }
    }
  }, []);

  // Save data to localStorage whenever checkIns changes
  useEffect(() => {
    localStorage.setItem('classCheckIns', JSON.stringify(checkIns));
  }, [checkIns]);

  const addCheckIn = (checkInData: Omit<ClassCheckIn, 'id' | 'createdAt'>) => {
    const newCheckIn: ClassCheckIn = {
      ...checkInData,
      id: `CHK${String(checkIns.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setCheckIns(prev => [...prev, newCheckIn]);
  };

  const getCheckInsByDate = (date: string) => {
    return checkIns.filter(checkIn => checkIn.checkInDate === date);
  };

  const getCheckInsByClass = (classId: string) => {
    return checkIns.filter(checkIn => checkIn.classId === classId);
  };

  const getCheckInsByDateRange = (startDate: string, endDate: string) => {
    return checkIns.filter(checkIn => 
      checkIn.checkInDate >= startDate && checkIn.checkInDate <= endDate
    );
  };

  const getCheckInsByStudentAndModality = (studentId: string, modalityName: string, startDate: string, endDate: string) => {
    return checkIns.filter(checkIn => 
      checkIn.studentId === studentId &&
      checkIn.fightModalities.includes(modalityName) &&
      checkIn.checkInDate >= startDate && 
      checkIn.checkInDate <= endDate
    );
  };

  const getTotalCheckIns = () => {
    return checkIns.length;
  };

  const getCheckInsThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    
    return getCheckInsByDateRange(startDate, endDate).length;
  };

  const getCheckInsThisMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    
    return getCheckInsByDateRange(startDate, endDate).length;
  };

  const getAverageCheckInsPerWeek = () => {
    if (checkIns.length === 0) return 0;
    
    const firstCheckIn = new Date(Math.min(...checkIns.map(c => new Date(c.createdAt).getTime())));
    const now = new Date();
    const weeksDiff = Math.ceil((now.getTime() - firstCheckIn.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    return weeksDiff > 0 ? Math.round(checkIns.length / weeksDiff) : 0;
  };

  const value: ClassCheckInContextType = {
    checkIns,
    addCheckIn,
    getCheckInsByDate,
    getCheckInsByClass,
    getCheckInsByDateRange,
    getCheckInsByStudentAndModality,
    getTotalCheckIns,
    getCheckInsThisWeek,
    getCheckInsThisMonth,
    getAverageCheckInsPerWeek,
  };

  return (
    <ClassCheckInContext.Provider value={value}>
      {children}
    </ClassCheckInContext.Provider>
  );
};
