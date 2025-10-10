import { describe, it, expect, vi, beforeEach } from "vitest";
import { seedSampleDataIfNeeded } from "../utils/seed";

describe("seedSampleDataIfNeeded", () => {
  const tenantId = "test-tenant";
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("seeds once per tenant", async () => {
    await seedSampleDataIfNeeded(tenantId);
    
    // Check that the seeded flag is set
    expect(localStorage.getItem(`oss365:seeded-${tenantId}`)).toBe("1");
    
    // Check that sample data was created
    const students = JSON.parse(localStorage.getItem(`oss365:students-${tenantId}`) || "[]");
    expect(Array.isArray(students)).toBe(true);
    expect(students.length).toBeGreaterThan(0);
    
    const teachers = JSON.parse(localStorage.getItem(`oss365:teachers-${tenantId}`) || "[]");
    expect(Array.isArray(teachers)).toBe(true);
    expect(teachers.length).toBeGreaterThan(0);
    
    const branches = JSON.parse(localStorage.getItem(`oss365:branches-${tenantId}`) || "[]");
    expect(Array.isArray(branches)).toBe(true);
    expect(branches.length).toBeGreaterThan(0);
  });

  it("does not reseed on subsequent calls", async () => {
    // First call
    await seedSampleDataIfNeeded(tenantId);
    const firstStudents = JSON.parse(localStorage.getItem(`oss365:students-${tenantId}`) || "[]");
    
    // Second call should not change the data
    await seedSampleDataIfNeeded(tenantId);
    const secondStudents = JSON.parse(localStorage.getItem(`oss365:students-${tenantId}`) || "[]");
    
    expect(secondStudents.length).toBe(firstStudents.length);
    expect(localStorage.getItem(`oss365:seeded-${tenantId}`)).toBe("1");
  });

  it("creates tenant-specific data", async () => {
    const tenant1 = "tenant-1";
    const tenant2 = "tenant-2";
    
    await seedSampleDataIfNeeded(tenant1);
    await seedSampleDataIfNeeded(tenant2);
    
    // Each tenant should have their own data
    const tenant1Students = JSON.parse(localStorage.getItem(`oss365:students-${tenant1}`) || "[]");
    const tenant2Students = JSON.parse(localStorage.getItem(`oss365:students-${tenant2}`) || "[]");
    
    expect(tenant1Students.length).toBeGreaterThan(0);
    expect(tenant2Students.length).toBeGreaterThan(0);
    
    // Data should be isolated per tenant
    expect(tenant1Students[0].tenantId).toBe(tenant1);
    expect(tenant2Students[0].tenantId).toBe(tenant2);
  });
});
