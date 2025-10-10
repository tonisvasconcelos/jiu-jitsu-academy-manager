// Utility functions for tenant-specific localStorage

export const getTenantStorageKey = (baseKey: string, tenantId: string): string => {
  return `${baseKey}-${tenantId}`
}

export const getTenantData = <T>(baseKey: string, tenantId: string | null, defaultValue: T): T => {
  if (!tenantId || tenantId === '') {
    console.warn(`No valid tenant context for ${baseKey}, returning default value`)
    return defaultValue
  }
  
  try {
    const storageKey = getTenantStorageKey(baseKey, tenantId)
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      console.log(`Loaded ${baseKey} from localStorage for tenant ${tenantId}:`, parsed)
      return parsed
    }
  } catch (error) {
    console.error(`Error loading ${baseKey} from localStorage:`, error)
  }
  
  console.log(`No saved data found for ${baseKey}, starting with default value`)
  return defaultValue
}

export const saveTenantData = <T>(baseKey: string, tenantId: string | null, data: T): void => {
  if (!tenantId) {
    console.log(`No tenant context for ${baseKey}, cannot save data`)
    return
  }
  
  try {
    const storageKey = getTenantStorageKey(baseKey, tenantId)
    localStorage.setItem(storageKey, JSON.stringify(data))
    console.log(`Saved ${baseKey} to localStorage for tenant ${tenantId}:`, data)
  } catch (error) {
    console.error(`Error saving ${baseKey} to localStorage:`, error)
  }
}

export const clearTenantData = (baseKey: string, tenantId: string | null): void => {
  if (!tenantId) {
    console.log(`No tenant context for ${baseKey}, cannot clear data`)
    return
  }
  
  try {
    const storageKey = getTenantStorageKey(baseKey, tenantId)
    localStorage.removeItem(storageKey)
    console.log(`Cleared ${baseKey} from localStorage for tenant ${tenantId}`)
  } catch (error) {
    console.error(`Error clearing ${baseKey} from localStorage:`, error)
  }
}

