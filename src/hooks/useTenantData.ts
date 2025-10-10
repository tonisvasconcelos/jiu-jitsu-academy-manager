// Custom hook for tenant-specific data management
// Handles the race condition between AuthContext loading and context initialization

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type EntityKey =
  | "students"
  | "teachers"
  | "branches"
  | "jiu-jitsu-fight-modalities"
  | "jiu-jitsu-weight-divisions"
  | "jiu-jitsu-class-schedules"
  | "jiu-jitsu-class-check-ins"
  | "jiu-jitsu-student-modalities"
  | "jiu-jitsu-branch-facilities"
  | "championships"
  | "championshipCategories"
  | "championshipOfficials"
  | "championshipQualifiedLocations"
  | "championshipRegistrations"
  | "championshipResults"
  | "championshipSponsors"
  | "fights"
  | "fightPhases"
  | "fightTeams"
  | "affiliations"
  | string;

export function useTenantData<T = any>(entity: EntityKey) {
  const { isLoading, isAuthenticated, tenant } = useAuth();
  const tenantId = tenant?.id ?? "";
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    // Gate: only read when auth hydrated + authenticated + tenantId exists
    if (isLoading) {
      // keep previous data or blank while hydrating
      return;
    }
    if (!isAuthenticated || !tenantId) {
      setData([]);
      console.log(`useTenantData(${entity}): auth not ready (isAuthenticated=${isAuthenticated}, tenantId="${tenantId}")`);
      return;
    }

    const storageKey = `oss365:${entity}-${tenantId}`;

    const load = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        const safe = Array.isArray(parsed) ? parsed : [];
        setData(safe);
        console.log(`useTenantData(${entity}): tenantId=${tenantId} key=${storageKey} loaded ${safe.length}`);
      } catch (e) {
        console.error(`useTenantData(${entity}): parse error for key=${storageKey}`, e);
        setData([]);
      }
    };

    load();

    // Refresh when storage updates (e.g., after seeding) and on tab visibility
    const onStorage = (e: StorageEvent) => { if (e.key === storageKey) load(); };
    const onVisible = () => { if (!document.hidden) load(); };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [entity, isLoading, isAuthenticated, tenantId]);

  return data;
}
