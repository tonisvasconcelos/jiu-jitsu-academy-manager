// Generic master data service for frontend
// Provides consistent API interface for all master data types

import { apiClient } from './api'

export interface MasterDataItem {
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
  [key: string]: any
}

export interface MasterDataResponse<T> {
  success: boolean
  data: T[]
  count: number
  message?: string
}

export interface CreateResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface UpdateResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface DeleteResponse {
  success: boolean
  message: string
}

// Valid master data types
export type MasterDataType = 
  | 'students'
  | 'teachers'
  | 'branches'
  | 'fightModalities'
  | 'weightDivisions'
  | 'classSchedules'
  | 'championships'
  | 'championshipCategories'
  | 'championshipRegistrations'
  | 'championshipResults'
  | 'championshipOfficials'
  | 'championshipSponsors'
  | 'championshipQualifiedLocations'
  | 'fightAssociations'
  | 'fightTeams'
  | 'fightPhases'
  | 'fights'
  | 'affiliations'
  | 'studentModalities'
  | 'branchFacilities'
  | 'classCheckIns'

class MasterDataService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Get all items for a data type
  async getAll<T extends MasterDataItem>(dataType: MasterDataType): Promise<T[]> {
    try {
      // Get tenant ID from auth context
      const authData = localStorage.getItem('auth_data');
      if (!authData) {
        console.log(`No auth data found for ${dataType}`);
        return [];
      }

      const parsed = JSON.parse(authData);
      const tenantId = parsed.tenant?.id;
      
      if (!tenantId) {
        console.log(`No tenant ID found for ${dataType}`);
        return [];
      }

      // Map dataType to localStorage key
      const storageKey = this.getStorageKey(dataType, tenantId);
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        console.log(`Loaded ${data.length} ${dataType} from tenant-specific storage for tenant ${tenantId}`);
        return data as T[];
      } else {
        console.log(`No ${dataType} data found for tenant ${tenantId}`);
        return [];
      }
    } catch (error: any) {
      console.error(`Error loading ${dataType} from tenant storage:`, error);
      return [];
    }
  }

  // Helper method to get the correct storage key for a data type
  private getStorageKey(dataType: MasterDataType, tenantId: string): string {
    const keyMappings: { [key in MasterDataType]: string } = {
      'students': `students-${tenantId}`,
      'teachers': `teachers-${tenantId}`,
      'branches': `branches-${tenantId}`,
      'fightModalities': `jiu-jitsu-fight-modalities-${tenantId}`,
      'weightDivisions': `jiu-jitsu-weight-divisions-${tenantId}`,
      'classSchedules': `jiu-jitsu-class-schedules-${tenantId}`,
      'championships': `jiu-jitsu-championships-${tenantId}`,
      'championshipCategories': `jiu-jitsu-championship-categories-${tenantId}`,
      'championshipRegistrations': `jiu-jitsu-championship-registrations-${tenantId}`,
      'championshipResults': `jiu-jitsu-championship-results-${tenantId}`,
      'championshipOfficials': `jiu-jitsu-championship-officials-${tenantId}`,
      'championshipSponsors': `jiu-jitsu-championship-sponsors-${tenantId}`,
      'championshipQualifiedLocations': `jiu-jitsu-championship-qualified-locations-${tenantId}`,
      'fightAssociations': `jiu-jitsu-fight-associations-${tenantId}`,
      'fightTeams': `jiu-jitsu-fight-teams-${tenantId}`,
      'fightPhases': `jiu-jitsu-fight-phases-${tenantId}`,
      'fights': `jiu-jitsu-fights-${tenantId}`,
      'affiliations': `jiu-jitsu-affiliations-${tenantId}`,
      'studentModalities': `jiu-jitsu-student-modalities-${tenantId}`,
      'branchFacilities': `jiu-jitsu-branch-facilities-${tenantId}`,
      'classCheckIns': `jiu-jitsu-class-check-ins-${tenantId}`
    };
    
    return keyMappings[dataType] || `${dataType}-${tenantId}`;
  }

  // Get item by ID
  async getById<T extends MasterDataItem>(dataType: MasterDataType, id: string): Promise<T | null> {
    try {
      const response = await apiClient.request<T>(
        `/master-data?dataType=${dataType}&id=${id}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      if (response.success && response.data) {
        return response.data
      } else {
        return null
      }
    } catch (error: any) {
      console.error(`Error loading ${dataType} with ID ${id}:`, error)
      throw new Error(error.message || `Failed to load ${dataType}`)
    }
  }

  // Create new item
  async create<T extends MasterDataItem>(dataType: MasterDataType, itemData: Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      // Get tenant ID from auth context
      const authData = localStorage.getItem('auth_data');
      if (!authData) {
        throw new Error('No auth data found');
      }

      const parsed = JSON.parse(authData);
      const tenantId = parsed.tenant?.id;
      
      if (!tenantId) {
        throw new Error('No tenant ID found');
      }

      // Create new item with required fields
      const newItem: T = {
        ...itemData,
        id: `${dataType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as T;

      // Get existing data
      const storageKey = this.getStorageKey(dataType, tenantId);
      const existing = localStorage.getItem(storageKey);
      const existingData = existing ? JSON.parse(existing) : [];

      // Add new item
      const updatedData = [...existingData, newItem];
      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      console.log(`Created ${dataType}:`, newItem);
      return newItem;
    } catch (error: any) {
      console.error(`Error creating ${dataType}:`, error);
      throw new Error(error.message || `Failed to create ${dataType}`);
    }
  }

  // Update item
  async update<T extends MasterDataItem>(dataType: MasterDataType, id: string, updateData: Partial<Omit<T, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>): Promise<T> {
    try {
      // Get tenant ID from auth context
      const authData = localStorage.getItem('auth_data');
      if (!authData) {
        throw new Error('No auth data found');
      }

      const parsed = JSON.parse(authData);
      const tenantId = parsed.tenant?.id;
      
      if (!tenantId) {
        throw new Error('No tenant ID found');
      }

      // Get existing data
      const storageKey = this.getStorageKey(dataType, tenantId);
      const existing = localStorage.getItem(storageKey);
      const existingData = existing ? JSON.parse(existing) : [];

      // Find and update item
      const itemIndex = existingData.findIndex((item: T) => item.id === id);
      if (itemIndex === -1) {
        throw new Error(`${dataType} with ID ${id} not found`);
      }

      const updatedItem: T = {
        ...existingData[itemIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      existingData[itemIndex] = updatedItem;
      localStorage.setItem(storageKey, JSON.stringify(existingData));

      console.log(`Updated ${dataType}:`, updatedItem);
      return updatedItem;
    } catch (error: any) {
      console.error(`Error updating ${dataType}:`, error);
      throw new Error(error.message || `Failed to update ${dataType}`);
    }
  }

  // Delete item
  async delete(dataType: MasterDataType, id: string): Promise<void> {
    try {
      // Get tenant ID from auth context
      const authData = localStorage.getItem('auth_data');
      if (!authData) {
        throw new Error('No auth data found');
      }

      const parsed = JSON.parse(authData);
      const tenantId = parsed.tenant?.id;
      
      if (!tenantId) {
        throw new Error('No tenant ID found');
      }

      // Get existing data
      const storageKey = this.getStorageKey(dataType, tenantId);
      const existing = localStorage.getItem(storageKey);
      const existingData = existing ? JSON.parse(existing) : [];

      // Find and remove item
      const itemIndex = existingData.findIndex((item: any) => item.id === id);
      if (itemIndex === -1) {
        throw new Error(`${dataType} with ID ${id} not found`);
      }

      existingData.splice(itemIndex, 1);
      localStorage.setItem(storageKey, JSON.stringify(existingData));

      console.log(`Deleted ${dataType} with ID:`, id);
    } catch (error: any) {
      console.error(`Error deleting ${dataType}:`, error);
      throw new Error(error.message || `Failed to delete ${dataType}`);
    }
  }
}

// Export singleton instance
export const masterDataService = new MasterDataService()
