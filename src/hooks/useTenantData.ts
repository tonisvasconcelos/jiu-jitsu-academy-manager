// Custom hook for tenant-specific data management
// Handles the race condition between AuthContext loading and context initialization

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function useTenantData<T>(key: string, tenantId?: string): T[] {
  const [data, setData] = useState<T[]>([]);
  const { tenant, isLoading: authLoading } = useAuth();
  
  useEffect(() => {
    const currentTenantId = tenantId || tenant?.id;
    if (!currentTenantId || authLoading) return;
    
    const storageKey = `oss365:${key}-${currentTenantId}`;
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    const safe = Array.isArray(parsed) ? parsed : [];
    setData(safe);
    console.log(`useTenantData(${key}): loaded ${safe.length} items for tenant ${currentTenantId}`);
  }, [key, tenantId, tenant?.id, authLoading]);
  
  return data;
}
