import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { testConnection } from '../config/database';
import { LicensePlan, UserRole, UserStatus, ClassStatus } from '../types';

/**
 * Script to create a new fight academy with complete setup
 * This simulates User Story 1: New academy purchasing a license
 */
async function createNewAcademy(): Promise<void> {
  try {
    console.log('🏢 Creating new fight academy...');
    
    // Test connection first
    await testConnection();

    // Academy details
    const academyDetails = {
      name: 'Elite Combat Academy',
      domain: 'elite-combat.jiu-jitsu.com',
      contactEmail: 'info@elite-combat.com',
      contactPhone: '+1-555-ELITE-01',
      address: '456 Fighting Street, Combat City, CC 54321',
      plan: LicensePlan.PROFESSIONAL,
      licenseDays: 365 // 1 year license
    };

    // Create new tenant
    const tenantId = uuidv4();
    const licenseStart = new Date();
    const licenseEnd = new Date(Date.now() + academyDetails.licenseDays * 24 * 60 * 60 * 1000);

    const tenant = await db.one(`
      INSERT INTO tenants (
        id, name, domain, plan, license_start, license_end, 
        is_active, contact_email, contact_phone, address, settings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      tenantId,
      academyDetails.name,
      academyDetails.domain,
      academyDetails.plan,
      licenseStart,
      licenseEnd,
      true,
      academyDetails.contactEmail,
      academyDetails.contactPhone,
      academyDetails.address,
      JSON.stringify({
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'ENU',
        features: {
          publicBooking: true,
          classScheduling: true,
          studentManagement: true,
          championshipManagement: true,
          advancedReporting: true
        },
        branding: {
          primaryColor: '#1e40af',
          secondaryColor: '#7c3aed',
          logoUrl: null
        }
      })
    ]);

    console.log('✅ Created tenant:', tenant.name);
    console.log(`   Domain: ${tenant.domain}`);
    console.log(`   License: ${tenant.plan} (expires: ${licenseEnd.toLocaleDateString()})`);

    // Create main branch
    const branchId = uuidv4();
    const branch = await db.one(`
      INSERT INTO branches (
        id, tenant_id, name, address, city, state, country, 
        postal_code, phone, email, is_active, 
        capacity, facilities, coordinates
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      branchId,
      tenantId,
      'Main Dojo',
      academyDetails.address,
      'Combat City',
      'CC',
      'USA',
      '54321',
      academyDetails.contactPhone,
      academyDetails.contactEmail,
      true,
      50,
      ['Main Training Area', 'Changing Rooms', 'Parking', 'Reception', 'Equipment Storage'],
      JSON.stringify({
        latitude: 40.7589,
        longitude: -73.9851
      })
    ]);

    console.log('✅ Created branch:', branch.name);

    // Create system manager
    const systemManagerId = uuidv4();
    const systemManagerPassword = await bcrypt.hash('EliteAdmin2024!', 12);
    const systemManager = await db.one(`
      INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      systemManagerId,
      tenantId,
      'admin@elite-combat.com',
      systemManagerPassword,
      'Alex',
      'Martinez',
      '+1-555-0001',
      UserRole.SYSTEM_MANAGER,
      UserStatus.ACTIVE,
      true
    ]);

    console.log('✅ Created system manager:', systemManager.email);

    // Create branch manager
    const branchManagerId = uuidv4();
    const branchManagerPassword = await bcrypt.hash('EliteManager2024!', 12);
    const branchManager = await db.one(`
      INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, branch_id, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      branchManagerId,
      tenantId,
      'manager@elite-combat.com',
      branchManagerPassword,
      'Sarah',
      'Johnson',
      '+1-555-0002',
      UserRole.BRANCH_MANAGER,
      UserStatus.ACTIVE,
      branchId,
      true
    ]);

    console.log('✅ Created branch manager:', branchManager.email);

    // Update branch with manager
    await db.none('UPDATE branches SET manager_id = $1 WHERE id = $2', [branchManagerId, branchId]);

    // Create coaches
    const coaches = [
      {
        id: uuidv4(),
        firstName: 'Marcus',
        lastName: 'Rodriguez',
        email: 'marcus@elite-combat.com',
        phone: '+1-555-0003',
        specialty: 'Brazilian Jiu-Jitsu'
      },
      {
        id: uuidv4(),
        firstName: 'Jessica',
        lastName: 'Chen',
        email: 'jessica@elite-combat.com',
        phone: '+1-555-0004',
        specialty: 'Muay Thai'
      },
      {
        id: uuidv4(),
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david@elite-combat.com',
        phone: '+1-555-0005',
        specialty: 'Boxing'
      }
    ];

    for (const coach of coaches) {
      const password = await bcrypt.hash('EliteCoach2024!', 12);
      await db.one(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, branch_id, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        coach.id,
        tenantId,
        coach.email,
        password,
        coach.firstName,
        coach.lastName,
        coach.phone,
        UserRole.COACH,
        UserStatus.ACTIVE,
        branchId,
        true
      ]);
      console.log(`✅ Created coach: ${coach.firstName} ${coach.lastName} (${coach.specialty})`);
    }

    // Create 20 students with realistic data
    const studentData = [
      { firstName: 'Emma', lastName: 'Williams', email: 'emma.w@email.com', phone: '+1-555-1001', studentId: 'EC001', birthDate: '1995-03-15', gender: 'female', beltLevel: 'blue', isKidsStudent: false },
      { firstName: 'James', lastName: 'Brown', email: 'james.b@email.com', phone: '+1-555-1002', studentId: 'EC002', birthDate: '1998-07-22', gender: 'male', beltLevel: 'white', isKidsStudent: false },
      { firstName: 'Sophia', lastName: 'Davis', email: 'sophia.d@email.com', phone: '+1-555-1003', studentId: 'EC003', birthDate: '2006-11-08', gender: 'female', beltLevel: 'kids-yellow', isKidsStudent: true },
      { firstName: 'Michael', lastName: 'Miller', email: 'michael.m@email.com', phone: '+1-555-1004', studentId: 'EC004', birthDate: '1992-01-30', gender: 'male', beltLevel: 'purple', isKidsStudent: false },
      { firstName: 'Olivia', lastName: 'Wilson', email: 'olivia.w@email.com', phone: '+1-555-1005', studentId: 'EC005', birthDate: '2004-05-12', gender: 'female', beltLevel: 'kids-orange', isKidsStudent: true },
      { firstName: 'William', lastName: 'Moore', email: 'william.m@email.com', phone: '+1-555-1006', studentId: 'EC006', birthDate: '1997-09-18', gender: 'male', beltLevel: 'blue', isKidsStudent: false },
      { firstName: 'Ava', lastName: 'Taylor', email: 'ava.t@email.com', phone: '+1-555-1007', studentId: 'EC007', birthDate: '2008-12-03', gender: 'female', beltLevel: 'kids-white', isKidsStudent: true },
      { firstName: 'Alexander', lastName: 'Anderson', email: 'alex.a@email.com', phone: '+1-555-1008', studentId: 'EC008', birthDate: '1994-04-25', gender: 'male', beltLevel: 'brown', isKidsStudent: false },
      { firstName: 'Isabella', lastName: 'Thomas', email: 'isabella.t@email.com', phone: '+1-555-1009', studentId: 'EC009', birthDate: '2005-08-14', gender: 'female', beltLevel: 'kids-green', isKidsStudent: true },
      { firstName: 'Benjamin', lastName: 'Jackson', email: 'benjamin.j@email.com', phone: '+1-555-1010', studentId: 'EC010', birthDate: '1996-06-07', gender: 'male', beltLevel: 'white', isKidsStudent: false },
      { firstName: 'Mia', lastName: 'White', email: 'mia.w@email.com', phone: '+1-555-1011', studentId: 'EC011', birthDate: '2007-10-20', gender: 'female', beltLevel: 'kids-yellow-white', isKidsStudent: true },
      { firstName: 'Lucas', lastName: 'Harris', email: 'lucas.h@email.com', phone: '+1-555-1012', studentId: 'EC012', birthDate: '1993-02-11', gender: 'male', beltLevel: 'blue', isKidsStudent: false },
      { firstName: 'Charlotte', lastName: 'Martin', email: 'charlotte.m@email.com', phone: '+1-555-1013', studentId: 'EC013', birthDate: '2009-01-16', gender: 'female', beltLevel: 'kids-gray', isKidsStudent: true },
      { firstName: 'Henry', lastName: 'Thompson', email: 'henry.t@email.com', phone: '+1-555-1014', studentId: 'EC014', birthDate: '1991-12-29', gender: 'male', beltLevel: 'black', isKidsStudent: false },
      { firstName: 'Amelia', lastName: 'Garcia', email: 'amelia.g@email.com', phone: '+1-555-1015', studentId: 'EC015', birthDate: '2003-07-05', gender: 'female', beltLevel: 'kids-orange-white', isKidsStudent: true },
      { firstName: 'Sebastian', lastName: 'Martinez', email: 'sebastian.m@email.com', phone: '+1-555-1016', studentId: 'EC016', birthDate: '1999-03-28', gender: 'male', beltLevel: 'purple', isKidsStudent: false },
      { firstName: 'Harper', lastName: 'Robinson', email: 'harper.r@email.com', phone: '+1-555-1017', studentId: 'EC017', birthDate: '2006-11-12', gender: 'female', beltLevel: 'kids-green-white', isKidsStudent: true },
      { firstName: 'Jack', lastName: 'Clark', email: 'jack.c@email.com', phone: '+1-555-1018', studentId: 'EC018', birthDate: '1995-05-19', gender: 'male', beltLevel: 'white', isKidsStudent: false },
      { firstName: 'Evelyn', lastName: 'Rodriguez', email: 'evelyn.r@email.com', phone: '+1-555-1019', studentId: 'EC019', birthDate: '2004-09-02', gender: 'female', beltLevel: 'kids-yellow', isKidsStudent: true },
      { firstName: 'Owen', lastName: 'Lewis', email: 'owen.l@email.com', phone: '+1-555-1020', studentId: 'EC020', birthDate: '1998-08-15', gender: 'male', beltLevel: 'blue', isKidsStudent: false }
    ];

    console.log('👥 Creating 20 students...');
    for (const student of studentData) {
      const userId = uuidv4();
      const password = await bcrypt.hash('EliteStudent2024!', 12);
      
      // Create user account
      const user = await db.one(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, branch_id, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        userId,
        tenantId,
        student.email,
        password,
        student.firstName,
        student.lastName,
        student.phone,
        UserRole.STUDENT,
        UserStatus.ACTIVE,
        branchId,
        true
      ]);

      // Create student profile
      await db.one(`
        INSERT INTO students (
          id, tenant_id, user_id, student_id, birth_date, gender,
          emergency_contact_name, emergency_contact_phone, belt_level,
          is_kids_student, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        uuidv4(),
        tenantId,
        user.id,
        student.studentId,
        student.birthDate,
        student.gender,
        `${student.firstName} ${student.lastName} Emergency Contact`,
        student.phone.replace(student.phone.slice(-4), '9999'),
        student.beltLevel,
        student.isKidsStudent,
        true
      ]);

      console.log(`   ✅ ${student.studentId}: ${student.firstName} ${student.lastName} (${student.beltLevel})`);
    }

    // Create sample classes
    const now = new Date();
    const classes = [
      {
        name: 'Beginner BJJ',
        description: 'Introduction to Brazilian Jiu-Jitsu fundamentals',
        coachId: coaches[0].id,
        modality: 'Brazilian Jiu-Jitsu',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // Tomorrow 6 PM
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // Tomorrow 7 PM
        maxCapacity: 20,
        price: 30.00
      },
      {
        name: 'Advanced BJJ',
        description: 'Advanced techniques and sparring',
        coachId: coaches[0].id,
        modality: 'Brazilian Jiu-Jitsu',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // Tomorrow 7 PM
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // Tomorrow 8 PM
        maxCapacity: 15,
        price: 35.00
      },
      {
        name: 'Kids BJJ',
        description: 'Fun and safe BJJ for children',
        coachId: coaches[0].id,
        modality: 'Brazilian Jiu-Jitsu',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // Tomorrow 4 PM
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // Tomorrow 5 PM
        maxCapacity: 12,
        price: 25.00
      },
      {
        name: 'Muay Thai Fundamentals',
        description: 'Learn the art of eight limbs',
        coachId: coaches[1].id,
        modality: 'Muay Thai',
        startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // Day after 6 PM
        endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // Day after 7 PM
        maxCapacity: 18,
        price: 32.00
      },
      {
        name: 'Boxing Basics',
        description: 'Fundamental boxing techniques and conditioning',
        coachId: coaches[2].id,
        modality: 'Boxing',
        startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // Day after 7 PM
        endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // Day after 8 PM
        maxCapacity: 16,
        price: 28.00
      }
    ];

    console.log('📅 Creating sample classes...');
    for (const cls of classes) {
      await db.one(`
        INSERT INTO classes (
          id, tenant_id, name, description, branch_id, coach_id,
          modality, start_time, end_time, max_capacity, current_enrollment,
          status, price
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        uuidv4(),
        tenantId,
        cls.name,
        cls.description,
        branchId,
        cls.coachId,
        cls.modality,
        cls.startTime,
        cls.endTime,
        cls.maxCapacity,
        0,
        ClassStatus.SCHEDULED,
        cls.price
      ]);
      console.log(`   ✅ ${cls.name} - ${cls.modality} ($${cls.price})`);
    }

    // Create subscription record
    await db.one(`
      INSERT INTO subscriptions (
        id, tenant_id, plan, status, current_period_start, current_period_end
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      uuidv4(),
      tenantId,
      academyDetails.plan,
      'active',
      licenseStart,
      licenseEnd
    ]);

    console.log('🎉 Elite Combat Academy setup completed successfully!');
    console.log('\n📋 Academy Summary:');
    console.log(`🏢 Academy: ${academyDetails.name}`);
    console.log(`🌐 Domain: ${academyDetails.domain}`);
    console.log(`📧 Contact: ${academyDetails.contactEmail}`);
    console.log(`📅 License: ${academyDetails.plan} (expires: ${licenseEnd.toLocaleDateString()})`);
    console.log(`👥 Users Created:`);
    console.log(`   👤 System Manager: admin@elite-combat.com (EliteAdmin2024!)`);
    console.log(`   👤 Branch Manager: manager@elite-combat.com (EliteManager2024!)`);
    console.log(`   👨‍🏫 Coaches: 3 coaches created`);
    console.log(`   👥 Students: 20 students created`);
    console.log(`📅 Classes: 5 sample classes created`);
    console.log(`🏢 Branch: Main Dojo with 50 capacity`);
    console.log('\n🔗 Access URLs:');
    console.log(`   🌐 Public Portal: http://localhost:5000/public?tenantDomain=${academyDetails.domain}`);
    console.log(`   🔐 Admin Login: http://localhost:3000/login`);
    console.log(`   📊 API Base: http://localhost:5000/api`);

  } catch (error) {
    console.error('❌ Academy creation failed:', error);
    throw error;
  }
}

// Run script if executed directly
if (require.main === module) {
  createNewAcademy()
    .then(() => {
      console.log('🎉 Elite Combat Academy created successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Academy creation failed:', error);
      process.exit(1);
    });
}

export default createNewAcademy;
