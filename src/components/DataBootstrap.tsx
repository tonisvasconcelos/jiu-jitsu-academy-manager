import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { seedSampleDataIfNeeded } from "../utils/seed";

const ENTITIES = [
  "students",
  "teachers", 
  "branches",
  "jiu-jitsu-fight-modalities",
  "jiu-jitsu-weight-divisions",
  "jiu-jitsu-class-schedules",
  "jiu-jitsu-class-check-ins",
  "championships",
  "championshipCategories",
  "championshipRegistrations",
  "championshipResults",
  "championshipOfficials",
  "championshipSponsors",
  "championshipQualifiedLocations",
  "fightAssociations",
  "fightTeams",
  "fightPhases",
  "fights",
  "affiliations",
  "jiu-jitsu-student-modalities",
  "jiu-jitsu-branch-facilities"
];

function countFor(tenantId: string, entity: string): number {
  const raw = localStorage.getItem(`oss365:${entity}-${tenantId}`);
  try { 
    const arr = raw ? JSON.parse(raw) : []; 
    return Array.isArray(arr) ? arr.length : 0; 
  } catch { 
    return 0; 
  }
}

interface DataBootstrapProps {
  children: React.ReactNode;
}

export default function DataBootstrap({ children }: DataBootstrapProps) {
  const { isLoading, isAuthenticated, tenant } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !tenant?.id) { 
      setReady(false); 
      return; 
    }

    (async () => {
      const tenantId = tenant.id;
      const flag = localStorage.getItem(`oss365:seeded-${tenantId}`);
      const totals = ENTITIES.map(e => countFor(tenantId, e)).reduce((a, b) => a + b, 0);

      console.log("DataBootstrap: tenantId=", tenantId, "seedFlag=", flag, "totalItems=", totals);

      // Seed if never seeded OR everything is empty (safety)
      if (flag !== "1" || totals === 0) {
        console.log("DataBootstrap: running seed for tenant", tenantId);
        await seedSampleDataIfNeeded(tenantId);
        // Give providers a chance to re-read storage on next tick
        requestAnimationFrame(() => setReady(true));
      } else {
        setReady(true);
      }
    })();
  }, [isLoading, isAuthenticated, tenant?.id]);

  // Optional: render spinner until bootstrap completes
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Bootstrapping data...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
