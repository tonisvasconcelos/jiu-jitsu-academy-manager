import React, { createContext, useState, useContext, ReactNode } from 'react'

export interface StudentModalityConnection {
  connectionId: string
  studentId: string
  modalityIds: string[]
  assignmentDate: string
  beltLevelAtStart: 'white' | 'blue' | 'purple' | 'brown' | 'black' | 
    'kids-white' | 'kids-gray-white' | 'kids-gray' | 'kids-gray-black' | 
    'kids-yellow-white' | 'kids-yellow' | 'kids-yellow-black' | 
    'kids-orange-white' | 'kids-orange' | 'kids-orange-black' | 
    'kids-green-white' | 'kids-green' | 'kids-green-black' |
    'judo-kids-white' | 'judo-kids-white-yellow' | 'judo-kids-yellow' | 
    'judo-kids-yellow-orange' | 'judo-kids-orange' | 'judo-kids-orange-green' | 'judo-kids-green'
  active: boolean
  closingDate?: string
  expectedClosingDate?: string
  expectedCheckInCount?: number
  stripesAtStart?: number
  expectedStripesAtConclusion?: number
  notes?: string
}

interface StudentModalityContextType {
  connections: StudentModalityConnection[]
  addConnection: (connection: StudentModalityConnection) => void
  updateConnection: (connectionId: string, updatedConnection: StudentModalityConnection) => void
  deleteConnection: (connectionId: string) => void
  getConnection: (connectionId: string) => StudentModalityConnection | undefined
  getConnectionsByStudent: (studentId: string) => StudentModalityConnection[]
  getConnectionsByModality: (modalityId: string) => StudentModalityConnection[]
}

const StudentModalityContext = createContext<StudentModalityContextType | undefined>(undefined)

// Sample initial data
const initialConnections: StudentModalityConnection[] = [
  {
    connectionId: 'CONN001',
    studentId: 'STU001',
    modalityIds: ['MOD001', 'MOD002'],
    assignmentDate: '2024-01-15',
    beltLevelAtStart: 'white',
    active: true,
    notes: 'Primary training modalities'
  },
  {
    connectionId: 'CONN002',
    studentId: 'STU002',
    modalityIds: ['MOD001'],
    assignmentDate: '2024-01-20',
    beltLevelAtStart: 'blue',
    active: true,
    notes: 'Focus on Brazilian Jiu-Jitsu'
  }
]

export const StudentModalityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load connections from localStorage or use initial data
  const loadConnectionsFromStorage = (): StudentModalityConnection[] => {
    try {
      const stored = localStorage.getItem('jiu-jitsu-student-modalities')
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('StudentModalityContext: Loaded connections from localStorage:', parsed)
        
        // Migrate old data to include beltLevelAtStart field
        const migratedConnections = parsed.map((connection: any) => ({
          ...connection,
          beltLevelAtStart: connection.beltLevelAtStart || 'white' // Default to white belt if missing
        }))
        
        // Save migrated data back to localStorage
        if (migratedConnections.some((conn: any, index: number) => !parsed[index].beltLevelAtStart)) {
          console.log('StudentModalityContext: Migrating data to include beltLevelAtStart field')
          localStorage.setItem('jiu-jitsu-student-modalities', JSON.stringify(migratedConnections))
        }
        
        return migratedConnections
      }
    } catch (error) {
      console.error('StudentModalityContext: Error loading connections from localStorage:', error)
    }
    console.log('StudentModalityContext: No saved data found, starting with initial connections data')
    return initialConnections
  }

  const [connections, setConnections] = useState<StudentModalityConnection[]>(loadConnectionsFromStorage)

  // Save connections to localStorage
  const saveConnectionsToStorage = (connectionsToSave: StudentModalityConnection[]) => {
    try {
      localStorage.setItem('jiu-jitsu-student-modalities', JSON.stringify(connectionsToSave))
      console.log('StudentModalityContext: Saved connections to localStorage:', connectionsToSave)
    } catch (error) {
      console.error('StudentModalityContext: Error saving connections to localStorage:', error)
    }
  }

  const addConnection = (connection: StudentModalityConnection) => {
    console.log('=== STUDENT MODALITY CONTEXT: ADD CONNECTION CALLED ===')
    console.log('StudentModalityContext: Adding connection:', connection)
    setConnections(prev => {
      const newConnections = [...prev, connection]
      console.log('StudentModalityContext: Previous connections count:', prev.length)
      console.log('StudentModalityContext: New connections array:', newConnections)
      console.log('StudentModalityContext: New connections count:', newConnections.length)
      saveConnectionsToStorage(newConnections)
      console.log('StudentModalityContext: Connections saved to localStorage')
      return newConnections
    })
  }

  const updateConnection = (connectionId: string, updatedConnection: StudentModalityConnection) => {
    setConnections(prev => {
      const updatedConnections = prev.map(connection => 
        connection.connectionId === connectionId ? updatedConnection : connection
      )
      saveConnectionsToStorage(updatedConnections)
      return updatedConnections
    })
  }

  const deleteConnection = (connectionId: string) => {
    setConnections(prev => {
      const filteredConnections = prev.filter(connection => connection.connectionId !== connectionId)
      saveConnectionsToStorage(filteredConnections)
      return filteredConnections
    })
  }

  const getConnection = (connectionId: string) => {
    return connections.find(connection => connection.connectionId === connectionId)
  }

  const getConnectionsByStudent = (studentId: string) => {
    return connections.filter(connection => connection.studentId === studentId)
  }

  const getConnectionsByModality = (modalityId: string) => {
    return connections.filter(connection => connection.modalityIds.includes(modalityId))
  }

  return (
    <StudentModalityContext.Provider value={{
      connections,
      addConnection,
      updateConnection,
      deleteConnection,
      getConnection,
      getConnectionsByStudent,
      getConnectionsByModality
    }}>
      {children}
    </StudentModalityContext.Provider>
  )
}

export const useStudentModalities = () => {
  const context = useContext(StudentModalityContext)
  if (context === undefined) {
    throw new Error('useStudentModalities must be used within a StudentModalityProvider')
  }
  return context
}
