import { useAuth } from "../contexts/AuthContext";
import { seedSampleDataIfNeeded } from "../utils/seed";
import React from "react";

export default function AdminDebug() {
  const { tenant } = useAuth();
  const tenantId = tenant?.id || "";

  const dump = () => {
    const rows: Array<{key: string; len: number}> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (tenantId && k.endsWith(`-${tenantId}`)) {
        try { 
          const v = JSON.parse(localStorage.getItem(k) || "[]"); 
          rows.push({key: k, len: Array.isArray(v) ? v.length : 0}); 
        } catch { 
          rows.push({key: k, len: -1}); 
        }
      }
    }
    return rows.sort((a, b) => a.key.localeCompare(b.key));
  };

  const rows = dump();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Debug</h1>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Info</h2>
          <div className="space-y-2">
            <div>tenantId: <code className="bg-gray-700 px-2 py-1 rounded">{tenantId}</code></div>
            <div>seedFlag: <code className="bg-gray-700 px-2 py-1 rounded">{localStorage.getItem(`oss365:seeded-${tenantId}`)}</code></div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button 
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            onClick={() => seedSampleDataIfNeeded(tenantId)}
          >
            Force Seed
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Storage Data ({rows.length} items)</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rows.length === 0 ? (
              <p className="text-gray-400">No tenant-specific data found</p>
            ) : (
              rows.map(r => (
                <div key={r.key} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <code className="text-sm">{r.key}</code>
                  <span className={`px-2 py-1 rounded text-sm ${
                    r.len > 0 ? 'bg-green-600' : r.len === -1 ? 'bg-red-600' : 'bg-gray-600'
                  }`}>
                    len={r.len}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All localStorage Keys</h2>
          <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
            {Array.from({length: localStorage.length}, (_, i) => localStorage.key(i)).map(key => (
              <div key={key} className="text-gray-300">
                <code>{key}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
