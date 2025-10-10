// Custom hook for tenant-specific data management
// Handles the race condition between AuthContext loading and context initialization

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getTenantData, saveTenantData } from '../utils/tenantStorage'

export function useTenantData<T>(
  baseKey: string,
  defaultValue: T
): [T, (data: T) => void, boolean] {
  const { tenant, isLoading: authLoading } = useAuth()
  const [data, setData] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  // Load data when auth loading completes and tenant is available
  useEffect(() => {
    console.log(`useTenantData(${baseKey}): authLoading=${authLoading}, tenant.id=${tenant?.id}`)
    if (!authLoading) {
      if (tenant?.id) {
        const loadedData = getTenantData<T>(baseKey, tenant.id, defaultValue)
        console.log(`useTenantData(${baseKey}): loaded data:`, loadedData)
        setData(loadedData)
        setIsLoading(false)
      } else {
        // No tenant available, use default value
        console.log(`useTenantData(${baseKey}): no tenant, using default value`)
        setData(defaultValue)
        setIsLoading(false)
      }
    }
  }, [tenant?.id, authLoading, baseKey, defaultValue])

  // Save data function
  const saveData = (newData: T) => {
    if (tenant?.id) {
      saveTenantData(baseKey, tenant.id, newData)
      setData(newData)
    }
  }

  return [data, saveData, isLoading]
}
