import { query } from '../config/sqlite-database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Simple SQLite setup for testing User Story 1
 * This creates the database tables and sample data
 */
async function setupSQLiteDatabase(): Promise<void> {
  try {
    console.log('🗄️ Setting up SQLite database for testing...');

    // Create tables
    await query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        domain TEXT NOT NULL UNIQUE,
        plan TEXT NOT NULL DEFAULT 'free',
        license_start TEXT DEFAULT CURRENT_TIMESTAMP,
        license_end TEXT,
        is_active INTEGER DEFAULT 1,
        contact_email TEXT,
        contact_phone TEXT,
        address TEXT,
        settings TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        role TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        branch_id TEXT,
        email_verified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS branches (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        address TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        postal_code TEXT,
        phone TEXT,
        email TEXT,
        is_active INTEGER DEFAULT 1,
        capacity INTEGER DEFAULT 50,
        manager_id TEXT,
        facilities TEXT,
        coordinates TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        FOREIGN KEY (manager_id) REFERENCES users(id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        birth_date TEXT,
        gender TEXT,
        emergency_contact_name TEXT,
        emergency_contact_phone TEXT,
        belt_level TEXT,
        is_kids_student INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        branch_id TEXT NOT NULL,
        coach_id TEXT NOT NULL,
        modality TEXT,
        start_time TEXT,
        end_time TEXT,
        max_capacity INTEGER DEFAULT 20,
        current_enrollment INTEGER DEFAULT 0,
        status TEXT DEFAULT 'scheduled',
        price REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id),
        FOREIGN KEY (coach_id) REFERENCES users(id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        current_period_start TEXT,
        current_period_end TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables created');

    // Create Elite Combat Academy
    const tenantId = uuidv4();
    const licenseStart = new Date().toISOString();
    const licenseEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    await query(`
      INSERT OR REPLACE INTO tenants (
        id, name, domain, plan, license_start, license_end, 
        is_active, contact_email, contact_phone, address, settings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tenantId,
      'Elite Combat Academy',
      'elite-combat.jiu-jitsu.com',
      'professional',
      licenseStart,
      licenseEnd,
      1,
      'info@elite-combat.com',
      '+1-555-ELITE-01',
      '456 Fighting Street, Combat City, CC 54321',
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
        }
      })
    ]);

    console.log('✅ Elite Combat Academy tenant created');

    // Create main branch
    const branchId = uuidv4();
    await query(`
      INSERT OR REPLACE INTO branches (
        id, tenant_id, name, address, city, state, country, 
        postal_code, phone, email, is_active, capacity, facilities
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      branchId,
      tenantId,
      'Main Dojo',
      '456 Fighting Street, Combat City, CC 54321',
      'Combat City',
      'CC',
      'USA',
      '54321',
      '+1-555-ELITE-01',
      'info@elite-combat.com',
      1,
      50,
      JSON.stringify(['Main Training Area', 'Changing Rooms', 'Parking', 'Reception'])
    ]);

    console.log('✅ Main Dojo branch created');

    // Create system manager
    const systemManagerId = uuidv4();
    const systemManagerPassword = await bcrypt.hash('EliteAdmin2024!', 12);
    await query(`
      INSERT OR REPLACE INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      systemManagerId,
      tenantId,
      'admin@elite-combat.com',
      systemManagerPassword,
      'Alex',
      'Martinez',
      '+1-555-0001',
      'system_manager',
      'active',
      1
    ]);

    console.log('✅ System manager created: admin@elite-combat.com');

    // Create branch manager
    const branchManagerId = uuidv4();
    const branchManagerPassword = await bcrypt.hash('EliteManager2024!', 12);
    await query(`
      INSERT OR REPLACE INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, branch_id, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      branchManagerId,
      tenantId,
      'manager@elite-combat.com',
      branchManagerPassword,
      'Sarah',
      'Johnson',
      '+1-555-0002',
      'branch_manager',
      'active',
      branchId,
      1
    ]);

    console.log('✅ Branch manager created: manager@elite-combat.com');

    // Update branch with manager
    await query('UPDATE branches SET manager_id = ? WHERE id = ?', [branchManagerId, branchId]);

    // Create coaches
    const coaches = [
      { firstName: 'Marcus', lastName: 'Rodriguez', email: 'marcus@elite-combat.com', phone: '+1-555-0003', specialty: 'Brazilian Jiu-Jitsu' },
      { firstName: 'Jessica', lastName: 'Chen', email: 'jessica@elite-combat.com', phone: '+1-555-0004', specialty: 'Muay Thai' },
      { firstName: 'David', lastName: 'Thompson', email: 'david@elite-combat.com', phone: '+1-555-0005', specialty: 'Boxing' }
    ];

    const coachIds = [];
    for (const coach of coaches) {
      const coachId = uuidv4();
      const password = await bcrypt.hash('EliteCoach2024!', 12);
      await query(`
        INSERT OR REPLACE INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, branch_id, email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        coachId,
        tenantId,
        coach.email,
        password,
        coach.firstName,
        coach.lastName,
        coach.phone,
        'coach',
        'active',
        branchId,
        1
      ]);
      coachIds.push(coachId);
      console.log(`✅ Coach created: ${coach.firstName} ${coach.lastName} (${coach.specialty})`);
    }

    // Create 20 students
    const studentData = [
      { firstName: 'Emma', lastName: 'Williams', email: 'emma.w@email.com', phone: '+1-555-1001', studentId: 'EC001', birthDate: '1995-03-15', gender: 'female', beltLevel: 'blue', isKidsStudent: 0 },
      { firstName: 'James', lastName: 'Brown', email: 'james.b@email.com', phone: '+1-555-1002', studentId: 'EC002', birthDate: '1998-07-22', gender: 'male', beltLevel: 'white', isKidsStudent: 0 },
      { firstName: 'Sophia', lastName: 'Davis', email: 'sophia.d@email.com', phone: '+1-555-1003', studentId: 'EC003', birthDate: '2006-11-08', gender: 'female', beltLevel: 'kids-yellow', isKidsStudent: 1 },
      { firstName: 'Michael', lastName: 'Miller', email: 'michael.m@email.com', phone: '+1-555-1004', studentId: 'EC004', birthDate: '1992-01-30', gender: 'male', beltLevel: 'purple', isKidsStudent: 0 },
      { firstName: 'Olivia', lastName: 'Wilson', email: 'olivia.w@email.com', phone: '+1-555-1005', studentId: 'EC005', birthDate: '2004-05-12', gender: 'female', beltLevel: 'kids-orange', isKidsStudent: 1 },
      { firstName: 'William', lastName: 'Moore', email: 'william.m@email.com', phone: '+1-555-1006', studentId: 'EC006', birthDate: '1997-09-18', gender: 'male', beltLevel: 'blue', isKidsStudent: 0 },
      { firstName: 'Ava', lastName: 'Taylor', email: 'ava.t@email.com', phone: '+1-555-1007', studentId: 'EC007', birthDate: '2008-12-03', gender: 'female', beltLevel: 'kids-white', isKidsStudent: 1 },
      { firstName: 'Alexander', lastName: 'Anderson', email: 'alex.a@email.com', phone: '+1-555-1008', studentId: 'EC008', birthDate: '1994-04-25', gender: 'male', beltLevel: 'brown', isKidsStudent: 0 },
      { firstName: 'Isabella', lastName: 'Thomas', email: 'isabella.t@email.com', phone: '+1-555-1009', studentId: 'EC009', birthDate: '2005-08-14', gender: 'female', beltLevel: 'kids-green', isKidsStudent: 1 },
      { firstName: 'Benjamin', lastName: 'Jackson', email: 'benjamin.j@email.com', phone: '+1-555-1010', studentId: 'EC010', birthDate: '1996-06-07', gender: 'male', beltLevel: 'white', isKidsStudent: 0 },
      { firstName: 'Mia', lastName: 'White', email: 'mia.w@email.com', phone: '+1-555-1011', studentId: 'EC011', birthDate: '2007-10-20', gender: 'female', beltLevel: 'kids-yellow-white', isKidsStudent: 1 },
      { firstName: 'Lucas', lastName: 'Harris', email: 'lucas.h@email.com', phone: '+1-555-1012', studentId: 'EC012', birthDate: '1993-02-11', gender: 'male', beltLevel: 'blue', isKidsStudent: 0 },
      { firstName: 'Charlotte', lastName: 'Martin', email: 'charlotte.m@email.com', phone: '+1-555-1013', studentId: 'EC013', birthDate: '2009-01-16', gender: 'female', beltLevel: 'kids-gray', isKidsStudent: 1 },
      { firstName: 'Henry', lastName: 'Thompson', email: 'henry.t@email.com', phone: '+1-555-1014', studentId: 'EC014', birthDate: '1991-12-29', gender: 'male', beltLevel: 'black', isKidsStudent: 0 },
      { firstName: 'Amelia', lastName: 'Garcia', email: 'amelia.g@email.com', phone: '+1-555-1015', studentId: 'EC015', birthDate: '2003-07-05', gender: 'female', beltLevel: 'kids-orange-white', isKidsStudent: 1 },
      { firstName: 'Sebastian', lastName: 'Martinez', email: 'sebastian.m@email.com', phone: '+1-555-1016', studentId: 'EC016', birthDate: '1999-03-28', gender: 'male', beltLevel: 'purple', isKidsStudent: 0 },
      { firstName: 'Harper', lastName: 'Robinson', email: 'harper.r@email.com', phone: '+1-555-1017', studentId: 'EC017', birthDate: '2006-11-12', gender: 'female', beltLevel: 'kids-green-white', isKidsStudent: 1 },
      { firstName: 'Jack', lastName: 'Clark', email: 'jack.c@email.com', phone: '+1-555-1018', studentId: 'EC018', birthDate: '1995-05-19', gender: 'male', beltLevel: 'white', isKidsStudent: 0 },
      { firstName: 'Evelyn', lastName: 'Rodriguez', email: 'evelyn.r@email.com', phone: '+1-555-1019', studentId: 'EC019', birthDate: '2004-09-02', gender: 'female', beltLevel: 'kids-yellow', isKidsStudent: 1 },
      { firstName: 'Owen', lastName: 'Lewis', email: 'owen.l@email.com', phone: '+1-555-1020', studentId: 'EC020', birthDate: '1998-08-15', gender: 'male', beltLevel: 'blue', isKidsStudent: 0 }
    ];

    console.log('👥 Creating 20 students...');
    for (const student of studentData) {
      const userId = uuidv4();
      const password = await bcrypt.hash('EliteStudent2024!', 12);
      
      // Create user account
      await query(`
        INSERT OR REPLACE INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, branch_id, email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        tenantId,
        student.email,
        password,
        student.firstName,
        student.lastName,
        student.phone,
        'student',
        'active',
        branchId,
        1
      ]);

      // Create student profile
      await query(`
        INSERT OR REPLACE INTO students (
          id, tenant_id, user_id, student_id, birth_date, gender,
          emergency_contact_name, emergency_contact_phone, belt_level,
          is_kids_student, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        tenantId,
        userId,
        student.studentId,
        student.birthDate,
        student.gender,
        `${student.firstName} ${student.lastName} Emergency Contact`,
        student.phone.replace(student.phone.slice(-4), '9999'),
        student.beltLevel,
        student.isKidsStudent,
        1
      ]);

      console.log(`   ✅ ${student.studentId}: ${student.firstName} ${student.lastName} (${student.beltLevel})`);
    }

    // Create sample classes
    const now = new Date();
    const classes = [
      {
        name: 'Beginner BJJ',
        description: 'Introduction to Brazilian Jiu-Jitsu fundamentals',
        coachId: coachIds[0],
        modality: 'Brazilian Jiu-Jitsu',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
        maxCapacity: 20,
        price: 30.00
      },
      {
        name: 'Advanced BJJ',
        description: 'Advanced techniques and sparring',
        coachId: coachIds[0],
        modality: 'Brazilian Jiu-Jitsu',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
        maxCapacity: 15,
        price: 35.00
      },
      {
        name: 'Kids BJJ',
        description: 'Fun and safe BJJ for children',
        coachId: coachIds[0],
        modality: 'Brazilian Jiu-Jitsu',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
        maxCapacity: 12,
        price: 25.00
      },
      {
        name: 'Muay Thai Fundamentals',
        description: 'Learn the art of eight limbs',
        coachId: coachIds[1],
        modality: 'Muay Thai',
        startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
        maxCapacity: 18,
        price: 32.00
      },
      {
        name: 'Boxing Basics',
        description: 'Fundamental boxing techniques and conditioning',
        coachId: coachIds[2],
        modality: 'Boxing',
        startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
        maxCapacity: 16,
        price: 28.00
      }
    ];

    console.log('📅 Creating sample classes...');
    for (const cls of classes) {
      await query(`
        INSERT OR REPLACE INTO classes (
          id, tenant_id, name, description, branch_id, coach_id,
          modality, start_time, end_time, max_capacity, current_enrollment,
          status, price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        'scheduled',
        cls.price
      ]);
      console.log(`   ✅ ${cls.name} - ${cls.modality} ($${cls.price})`);
    }

    // Create subscription record
    await query(`
      INSERT OR REPLACE INTO subscriptions (
        id, tenant_id, plan, status, current_period_start, current_period_end
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      uuidv4(),
      tenantId,
      'professional',
      'active',
      licenseStart,
      licenseEnd
    ]);

    console.log('🎉 Elite Combat Academy setup completed successfully!');
    console.log('\n📋 Academy Summary:');
    console.log(`🏢 Academy: Elite Combat Academy`);
    console.log(`🌐 Domain: elite-combat.jiu-jitsu.com`);
    console.log(`📧 Contact: info@elite-combat.com`);
    console.log(`📅 License: professional (expires: ${new Date(licenseEnd).toLocaleDateString()})`);
    console.log(`👥 Users Created:`);
    console.log(`   👤 System Manager: admin@elite-combat.com (EliteAdmin2024!)`);
    console.log(`   👤 Branch Manager: manager@elite-combat.com (EliteManager2024!)`);
    console.log(`   👨‍🏫 Coaches: 3 coaches created`);
    console.log(`   👥 Students: 20 students created`);
    console.log(`📅 Classes: 5 sample classes created`);
    console.log(`🏢 Branch: Main Dojo with 50 capacity`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Run script if executed directly
if (require.main === module) {
  setupSQLiteDatabase()
    .then(() => {
      console.log('🎉 SQLite database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

export default setupSQLiteDatabase;
