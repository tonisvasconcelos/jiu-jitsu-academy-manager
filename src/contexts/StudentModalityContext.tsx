import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getTenantData, saveTenantData } from '../utils/tenantStorage'

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
  expectedBeltAtClosing?: 'white' | 'blue' | 'purple' | 'brown' | 'black' | 
    'kids-white' | 'kids-gray-white' | 'kids-gray' | 'kids-gray-black' | 
    'kids-yellow-white' | 'kids-yellow' | 'kids-yellow-black' | 
    'kids-orange-white' | 'kids-orange' | 'kids-orange-black' | 
    'kids-green-white' | 'kids-green' | 'kids-green-black' |
    'judo-kids-white' | 'judo-kids-white-yellow' | 'judo-kids-yellow' | 
    'judo-kids-yellow-orange' | 'judo-kids-orange' | 'judo-kids-orange-green' | 'judo-kids-green'
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
  const { tenant } = useAuth()
  
  // Load connections from localStorage or use initial data
  const loadConnectionsFromStorage = (): StudentModalityConnection[] => {
    const connections = getTenantData<StudentModalityConnection[]>('jiu-jitsu-student-modalities', tenant?.id || null, initialConnections)
    
    // Migrate old data to include beltLevelAtStart field
    const migratedConnections = connections.map((connection: any) => ({
      ...connection,
      beltLevelAtStart: connection.beltLevelAtStart || 'white' // Default to white belt if missing
    }))
    
    // Save migrated data back to localStorage if there were changes
    if (migratedConnections.some((conn: any, index: number) => !connections[index].beltLevelAtStart)) {
      console.log('StudentModalityContext: Migrating data to include beltLevelAtStart field')
      saveTenantData('jiu-jitsu-student-modalities', tenant?.id || null, migratedConnections)
    }
    
    return migratedConnections
  }

  const [connections, setConnections] = useState<StudentModalityConnection[]>(loadConnectionsFromStorage)

  // Reload connections when tenant changes
  useEffect(() => {
    const newConnections = loadConnectionsFromStorage()
    setConnections(newConnections)
  }, [tenant?.id])

  // Save connections to localStorage
  const saveConnectionsToStorage = (connectionsToSave: StudentModalityConnection[]) => {
    saveTenantData('jiu-jitsu-student-modalities', tenant?.id || null, connectionsToSave)
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
