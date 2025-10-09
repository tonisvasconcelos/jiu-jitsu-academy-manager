// Generic hook for master data management
// Replaces localStorage pattern with API-based persistence

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { masterDataService, MasterDataType, MasterDataItem } from '../services/masterDataService'

export interface UseMasterDataOptions<T> {
  dataType: MasterDataType
  initialData?: T[]
}

export interface UseMasterDataReturn<T> {
  data: T[]
  isLoading: boolean
  error: string | null
  addItem: (item: Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateItem: (id: string, updates: Partial<Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  refreshData: () => Promise<void>
  clearError: () => void
}

export function useMasterData<T extends MasterDataItem>({
  dataType,
  initialData = []
}: UseMasterDataOptions<T>): UseMasterDataReturn<T> {
  const { tenant, user } = useAuth()
  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load data from API
  const loadData = useCallback(async (): Promise<T[]> => {
    if (!tenant?.id || !user) {
      console.log(`No tenant or user context for ${dataType}, returning empty data`)
      return []
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const items = await masterDataService.getAll<T>(dataType)
      console.log(`Loaded ${items.length} ${dataType} from API for tenant ${tenant.id}`)
      return items
    } catch (error: any) {
      console.error(`Error loading ${dataType} from API:`, error)
      setError(error.message || `Failed to load ${dataType}`)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [dataType, tenant?.id, user?.id])

  // Load data when component mounts or tenant changes
  useEffect(() => {
    if (tenant?.id && user) {
      loadData().then(setData)
    } else {
      setData([])
    }
  }, [loadData])

  // Add new item
  const addItem = useCallback(async (item: Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    if (!tenant?.id || !user) {
      throw new Error('No tenant or user context available')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const newItem = await masterDataService.create<T>(dataType, item)
      console.log(`Created ${dataType}:`, newItem)
      setData(prev => [...prev, newItem])
    } catch (error: any) {
      console.error(`Error creating ${dataType}:`, error)
      setError(error.message || `Failed to create ${dataType}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [dataType, tenant?.id, user])

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
    if (!tenant?.id || !user) {
      throw new Error('No tenant or user context available')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const updatedItem = await masterDataService.update<T>(dataType, id, updates)
      console.log(`Updated ${dataType}:`, updatedItem)
      setData(prev => prev.map(item => item.id === id ? updatedItem : item))
    } catch (error: any) {
      console.error(`Error updating ${dataType}:`, error)
      setError(error.message || `Failed to update ${dataType}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [dataType, tenant?.id, user])

  // Delete item
  const deleteItem = useCallback(async (id: string): Promise<void> => {
    if (!tenant?.id || !user) {
      throw new Error('No tenant or user context available')
    }

    try {
      setIsLoading(true)
      setError(null)
      
      await masterDataService.delete(dataType, id)
      console.log(`Deleted ${dataType} with ID:`, id)
      setData(prev => prev.filter(item => item.id !== id))
    } catch (error: any) {
      console.error(`Error deleting ${dataType}:`, error)
      setError(error.message || `Failed to delete ${dataType}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [dataType, tenant?.id, user])

  // Refresh data
  const refreshData = useCallback(async (): Promise<void> => {
    const items = await loadData()
    setData(items)
  }, [loadData])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refreshData,
    clearError
  }
}
