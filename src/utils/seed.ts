export async function seedSampleDataIfNeeded(tenantId: string): Promise<void> {
  if (!tenantId) { 
    console.error("Seed: missing tenantId"); 
    return; 
  }
  
  const FLAG = `oss365:seeded-${tenantId}`;
  
  if (localStorage.getItem(FLAG) === "1") {
    console.log(`Seed: already done for ${tenantId}`);
    return;
  }
  
  console.log(`Seed: creating sample data for ${tenantId}`);

  const seeds: Record<string, any[]> = {
    students: [
      {
        id: 'student_1',
        tenantId: tenantId,
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        birthDate: '1990-01-01',
        gender: 'male',
        beltLevel: 'blue',
        documentId: '12345678901',
        email: 'john.doe@example.com',
        phone: '1234567890',
        branchId: 'main-branch',
        active: true,
        isKidsStudent: false,
        weight: 80,
        weightDivisionId: 'middleweight',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    teachers: [
      {
        id: 'teacher_1',
        tenantId: tenantId,
        firstName: 'Master',
        lastName: 'Instructor',
        displayName: 'Master Instructor',
        email: 'master@example.com',
        phone: '1111111111',
        branchId: 'main-branch',
        active: true,
        beltLevel: 'black',
        specialization: 'Brazilian Jiu-Jitsu',
        experience: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    branches: [
      {
        id: 'main-branch',
        tenantId: tenantId,
        name: 'Main Branch',
        address: '123 Main Street',
        phone: '555-0123',
        email: 'main@example.com',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'jiu-jitsu-fight-modalities': [
      {
        id: 'modality_1',
        tenantId: tenantId,
        name: 'Gi Jiu-Jitsu',
        description: 'Traditional gi-based jiu-jitsu',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'jiu-jitsu-weight-divisions': [
      {
        id: 'weight_1',
        tenantId: tenantId,
        name: 'Middleweight',
        minWeight: 70,
        maxWeight: 80,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'jiu-jitsu-class-schedules': [
      {
        id: 'class_1',
        tenantId: tenantId,
        name: 'Morning Class',
        branchId: 'main-branch',
        teacherId: 'teacher_1',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'jiu-jitsu-class-check-ins': [
      {
        id: 'checkin_1',
        tenantId: tenantId,
        studentId: 'student_1',
        classId: 'class_1',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'jiu-jitsu-branch-facilities': [
      {
        id: 'facility_1',
        tenantId: tenantId,
        branchId: 'main-branch',
        name: 'Main Training Area',
        type: 'training-mat',
        capacity: 20,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    'jiu-jitsu-student-modalities': [
      {
        id: 'connection_1',
        tenantId: tenantId,
        studentId: 'student_1',
        modalityId: 'modality_1',
        startDate: new Date().toISOString(),
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  // Store tenant-specific data with oss365 prefix
  Object.entries(seeds).forEach(([key, data]) => {
    const storageKey = `oss365:${key}-${tenantId}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`Seed: wrote ${storageKey} len=${data.length}`);
  });

  // Mark as seeded
  localStorage.setItem(FLAG, "1");
  console.log(`Seed: done for ${tenantId}`);
}
