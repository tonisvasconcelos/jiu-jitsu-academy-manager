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
    const load = () => {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const safe = Array.isArray(parsed) ? parsed : [];
      setData(safe);
      console.log(`useTenantData(${key}): tenantId=${currentTenantId} key=${storageKey} loaded ${safe.length}`);
    };
    load();

    const onStorage = (e: StorageEvent) => { 
      if (e.key === storageKey) load(); 
    };
    const onVisible = () => { 
      if (!document.hidden) load(); 
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [key, tenantId, tenant?.id, authLoading]);
  
  return data;
}
