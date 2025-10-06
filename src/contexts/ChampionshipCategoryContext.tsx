import React, { createContext, useContext, useState, useEffect } from 'react'

export interface ChampionshipCategory {
  categoryId: string
  ageGroups: ('kids' | 'adult' | 'master' | 'senior')[]
  belts: ('white' | 'blue' | 'purple' | 'brown' | 'black' | 'all-belts')[]
  weightCategory: string
  weightLimit?: number
  gender: 'male' | 'female' | 'mixed'
  fightAssociation: string
  fightModalities: string[]
}

interface ChampionshipCategoryContextType {
  categories: ChampionshipCategory[]
  addCategory: (category: Omit<ChampionshipCategory, 'categoryId'>) => void
  updateCategory: (id: string, category: Partial<ChampionshipCategory>) => void
  deleteCategory: (id: string) => void
  getCategory: (id: string) => ChampionshipCategory | undefined
  getCategoriesByChampionship: (championshipId: string) => ChampionshipCategory[]
  getCategoriesByBelt: (belt: string) => ChampionshipCategory[]
  getCategoriesByAgeGroup: (ageGroup: string) => ChampionshipCategory[]
}

const ChampionshipCategoryContext = createContext<ChampionshipCategoryContextType | undefined>(undefined)

export const useChampionshipCategories = () => {
  const context = useContext(ChampionshipCategoryContext)
  if (!context) {
    throw new Error('useChampionshipCategories must be used within a ChampionshipCategoryProvider')
  }
  return context
}

export const ChampionshipCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ChampionshipCategory[]>([])

  // Load categories from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('championshipCategories')
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (error) {
        console.error('Error loading championship categories from localStorage:', error)
      }
    }
  }, [])

  // Save categories to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('championshipCategories', JSON.stringify(categories))
  }, [categories])

  const addCategory = (category: Omit<ChampionshipCategory, 'categoryId'>) => {
    const newCategory: ChampionshipCategory = {
      ...category,
      categoryId: `CAT${Date.now().toString().slice(-6)}`
    }
    setCategories(prev => [...prev, newCategory])
  }

  const updateCategory = (id: string, updatedCategory: Partial<ChampionshipCategory>) => {
    setCategories(prev => 
      prev.map(category => 
        category.categoryId === id 
          ? { ...category, ...updatedCategory }
          : category
      )
    )
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.categoryId !== id))
  }

  const getCategory = (id: string) => {
    return categories.find(category => category.categoryId === id)
  }

  const getCategoriesByChampionship = (championshipId: string) => {
    // Since championshipId is no longer part of the category, return all categories
    // This function can be used for future championship-specific filtering if needed
    return categories
  }

  const getCategoriesByBelt = (belt: string) => {
    return categories.filter(category => category.belts.includes(belt as any))
  }

  const getCategoriesByAgeGroup = (ageGroup: string) => {
    return categories.filter(category => category.ageGroups.includes(ageGroup as any))
  }

  const value: ChampionshipCategoryContextType = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategoriesByChampionship,
    getCategoriesByBelt,
    getCategoriesByAgeGroup
  }

  return (
    <ChampionshipCategoryContext.Provider value={value}>
      {children}
    </ChampionshipCategoryContext.Provider>
  )
}
