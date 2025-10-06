import React, { createContext, useContext, useState, useEffect } from 'react'

export interface FightTeam {
  teamId: string
  teamName: string
  description?: string
  coachId: string
  coachName: string
  branchId: string
  branchName: string
  modality: string
  establishedDate: string
  teamSize: number
  maxTeamSize: number
  isActive: boolean
  achievements?: string[]
  teamMembers: string[] // Array of student IDs
  teamLogo?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface FightTeamContextType {
  fightTeams: FightTeam[]
  addFightTeam: (team: Omit<FightTeam, 'teamId' | 'createdAt' | 'updatedAt'>) => void
  updateFightTeam: (id: string, team: Partial<FightTeam>) => void
  deleteFightTeam: (id: string) => void
  getFightTeam: (id: string) => FightTeam | undefined
  getFightTeamsByBranch: (branchId: string) => FightTeam[]
  getFightTeamsByModality: (modality: string) => FightTeam[]
  getFightTeamsByCoach: (coachId: string) => FightTeam[]
}

const FightTeamContext = createContext<FightTeamContextType | undefined>(undefined)

export const useFightTeams = () => {
  const context = useContext(FightTeamContext)
  if (!context) {
    throw new Error('useFightTeams must be used within a FightTeamProvider')
  }
  return context
}

export const FightTeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fightTeams, setFightTeams] = useState<FightTeam[]>([])

  // Load fight teams from localStorage on mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('fightTeams')
    if (savedTeams) {
      try {
        setFightTeams(JSON.parse(savedTeams))
      } catch (error) {
        console.error('Error loading fight teams from localStorage:', error)
      }
    } else {
      // Initialize with sample data
      const sampleTeams: FightTeam[] = [
        {
          teamId: 'FT001',
          teamName: 'Rio Elite Fighters',
          description: 'Elite competition team focused on Brazilian Jiu-Jitsu',
          coachId: 'T001',
          coachName: 'Carlos Silva',
          branchId: 'B001',
          branchName: 'Rio de Janeiro Main',
          modality: 'Brazilian Jiu-Jitsu',
          establishedDate: '2023-01-15',
          teamSize: 8,
          maxTeamSize: 12,
          isActive: true,
          achievements: [
            '2024 State Championship - 1st Place',
            '2024 Regional Tournament - 2nd Place',
            '2023 National Championship - 3rd Place'
          ],
          teamMembers: ['S001', 'S002', 'S003', 'S004', 'S005', 'S006', 'S007', 'S008'],
          teamLogo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200&h=200&fit=crop',
          contactEmail: 'rioelite@academy.com',
          contactPhone: '+55 21 99999-8888',
          notes: 'Focus on competition preparation and advanced techniques',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          teamId: 'FT002',
          teamName: 'Abu Dhabi Warriors',
          description: 'International competition team for UAE championships',
          coachId: 'T002',
          coachName: 'Ahmed Al-Rashid',
          branchId: 'B002',
          branchName: 'Abu Dhabi Branch',
          modality: 'Brazilian Jiu-Jitsu',
          establishedDate: '2023-03-20',
          teamSize: 6,
          maxTeamSize: 10,
          isActive: true,
          achievements: [
            '2024 UAE National Championship - 1st Place',
            '2024 Abu Dhabi Grand Slam - 2nd Place'
          ],
          teamMembers: ['S009', 'S010', 'S011', 'S012', 'S013', 'S014'],
          teamLogo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
          contactEmail: 'warriors@adcc.com',
          contactPhone: '+971 50 123 4567',
          notes: 'Specialized in no-gi competition',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          teamId: 'FT003',
          teamName: 'Los Angeles Grapplers',
          description: 'Youth development team for upcoming fighters',
          coachId: 'T003',
          coachName: 'Maria Rodriguez',
          branchId: 'B003',
          branchName: 'Los Angeles Branch',
          modality: 'Brazilian Jiu-Jitsu',
          establishedDate: '2023-06-10',
          teamSize: 4,
          maxTeamSize: 8,
          isActive: true,
          achievements: [
            '2024 Youth State Championship - 1st Place'
          ],
          teamMembers: ['S015', 'S016', 'S017', 'S018'],
          teamLogo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
          contactEmail: 'grapplers@lacc.com',
          contactPhone: '+1 213 741-1151',
          notes: 'Focus on youth development and fundamentals',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setFightTeams(sampleTeams)
    }
  }, [])

  // Save fight teams to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('fightTeams', JSON.stringify(fightTeams))
  }, [fightTeams])

  const addFightTeam = (team: Omit<FightTeam, 'teamId' | 'createdAt' | 'updatedAt'>) => {
    const newTeam: FightTeam = {
      ...team,
      teamId: `FT${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setFightTeams(prev => [...prev, newTeam])
  }

  const updateFightTeam = (id: string, updatedTeam: Partial<FightTeam>) => {
    setFightTeams(prev => 
      prev.map(team => 
        team.teamId === id 
          ? { ...team, ...updatedTeam, updatedAt: new Date().toISOString() }
          : team
      )
    )
  }

  const deleteFightTeam = (id: string) => {
    setFightTeams(prev => prev.filter(team => team.teamId !== id))
  }

  const getFightTeam = (id: string) => {
    return fightTeams.find(team => team.teamId === id)
  }

  const getFightTeamsByBranch = (branchId: string) => {
    return fightTeams.filter(team => team.branchId === branchId)
  }

  const getFightTeamsByModality = (modality: string) => {
    return fightTeams.filter(team => team.modality === modality)
  }

  const getFightTeamsByCoach = (coachId: string) => {
    return fightTeams.filter(team => team.coachId === coachId)
  }

  const value: FightTeamContextType = {
    fightTeams,
    addFightTeam,
    updateFightTeam,
    deleteFightTeam,
    getFightTeam,
    getFightTeamsByBranch,
    getFightTeamsByModality,
    getFightTeamsByCoach
  }

  return (
    <FightTeamContext.Provider value={value}>
      {children}
    </FightTeamContext.Provider>
  )
}
