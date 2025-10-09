import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, testConnection } from '../config/sqlite-database';

/**
 * Simple script to create GFTeam Tubarão fight academy using SQLite
 * Customer: GFTeam Tubarão
 * Location: Rio de Janeiro, Brazil
 */
async function createGFTeamTubaraoSimple(): Promise<void> {
  try {
    console.log('🥊 Creating GFTeam Tubarão Academy...');
    
    // Test connection first
    await testConnection();

    // Academy details
    const academyDetails = {
      name: 'GFTeam Tubarão',
      domain: 'tubaraobjj.com',
      contactEmail: 'marciotubaraobjj@gmail.com',
      contactPhone: '+55 21 97366-8820',
      address: 'R. Teodoro da Silva, 725 - Vila Isabel, Rio de Janeiro - RJ, 20560-060',
      plan: 'ENTERPRISE',
      licenseDays: 365 // 1 year license
    };

    // Create new tenant
    const tenantId = uuidv4();
    const licenseStart = new Date();
    const licenseEnd = new Date(Date.now() + academyDetails.licenseDays * 24 * 60 * 60 * 1000);

    await query(`
      INSERT INTO tenants (
        id, name, domain, plan, license_start, license_end, 
        is_active, contact_email, contact_phone, address, settings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tenantId,
      academyDetails.name,
      academyDetails.domain,
      academyDetails.plan,
      licenseStart.toISOString(),
      licenseEnd.toISOString(),
      1, // is_active as integer
      academyDetails.contactEmail,
      academyDetails.contactPhone,
      academyDetails.address,
      JSON.stringify({
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'PT-BR',
        features: {
          publicBooking: true,
          classScheduling: true,
          studentManagement: true,
          championshipManagement: true,
          advancedReporting: true,
          multiBranchManagement: true,
          customBranding: true,
          apiAccess: true
        },
        branding: {
          primaryColor: '#1e40af',
          secondaryColor: '#7c3aed',
          logoUrl: null
        }
      })
    ]);

    console.log('✅ Created tenant:', academyDetails.name);
    console.log(`   Domain: ${academyDetails.domain}`);
    console.log(`   License: ${academyDetails.plan} (expires: ${licenseEnd.toLocaleDateString()})`);

    // Create system manager
    const systemManagerId = uuidv4();
    const systemManagerPassword = await bcrypt.hash('GFTeamAdmin2024!', 12);
    
    await query(`
      INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      systemManagerId,
      tenantId,
      'admin@tubaraobjj.com',
      systemManagerPassword,
      'Márcio',
      'Tubarão',
      academyDetails.contactPhone,
      'SYSTEM_MANAGER',
      'active',
      1 // email_verified as integer
    ]);

    console.log('✅ Created system manager: admin@tubaraobjj.com');

    // Create 3 branch managers
    const branchManagers = [
      {
        id: uuidv4(),
        firstName: 'Carlos',
        lastName: 'Silva',
        email: 'carlos@tubaraobjj.com',
        phone: '+55 21 99999-1111'
      },
      {
        id: uuidv4(),
        firstName: 'Ana',
        lastName: 'Santos',
        email: 'ana@tubaraobjj.com',
        phone: '+55 21 99999-2222'
      },
      {
        id: uuidv4(),
        firstName: 'Roberto',
        lastName: 'Oliveira',
        email: 'roberto@tubaraobjj.com',
        phone: '+55 21 99999-3333'
      }
    ];

    console.log('👥 Creating 3 branch managers...');
    for (const manager of branchManagers) {
      const password = await bcrypt.hash('GFTeamManager2024!', 12);
      await query(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        manager.id,
        tenantId,
        manager.email,
        password,
        manager.firstName,
        manager.lastName,
        manager.phone,
        'BRANCH_MANAGER',
        'active',
        1
      ]);
      console.log(`   ✅ ${manager.firstName} ${manager.lastName} - ${manager.email}`);
    }

    // Create 10 coaches
    const coaches = [
      {
        id: uuidv4(),
        firstName: 'João',
        lastName: 'Pereira',
        email: 'joao@tubaraobjj.com',
        phone: '+55 21 98888-1111',
        specialty: 'Brazilian Jiu-Jitsu'
      },
      {
        id: uuidv4(),
        firstName: 'Maria',
        lastName: 'Fernandes',
        email: 'maria@tubaraobjj.com',
        phone: '+55 21 98888-2222',
        specialty: 'Brazilian Jiu-Jitsu'
      },
      {
        id: uuidv4(),
        firstName: 'Pedro',
        lastName: 'Costa',
        email: 'pedro@tubaraobjj.com',
        phone: '+55 21 98888-3333',
        specialty: 'Muay Thai'
      },
      {
        id: uuidv4(),
        firstName: 'Lucia',
        lastName: 'Rodrigues',
        email: 'lucia@tubaraobjj.com',
        phone: '+55 21 98888-4444',
        specialty: 'Brazilian Jiu-Jitsu'
      },
      {
        id: uuidv4(),
        firstName: 'Rafael',
        lastName: 'Almeida',
        email: 'rafael@tubaraobjj.com',
        phone: '+55 21 98888-5555',
        specialty: 'Boxing'
      },
      {
        id: uuidv4(),
        firstName: 'Fernanda',
        lastName: 'Lima',
        email: 'fernanda@tubaraobjj.com',
        phone: '+55 21 98888-6666',
        specialty: 'Brazilian Jiu-Jitsu'
      },
      {
        id: uuidv4(),
        firstName: 'Diego',
        lastName: 'Mendes',
        email: 'diego@tubaraobjj.com',
        phone: '+55 21 98888-7777',
        specialty: 'Muay Thai'
      },
      {
        id: uuidv4(),
        firstName: 'Camila',
        lastName: 'Barbosa',
        email: 'camila@tubaraobjj.com',
        phone: '+55 21 98888-8888',
        specialty: 'Brazilian Jiu-Jitsu'
      },
      {
        id: uuidv4(),
        firstName: 'Thiago',
        lastName: 'Nascimento',
        email: 'thiago@tubaraobjj.com',
        phone: '+55 21 98888-9999',
        specialty: 'Boxing'
      },
      {
        id: uuidv4(),
        firstName: 'Juliana',
        lastName: 'Vieira',
        email: 'juliana@tubaraobjj.com',
        phone: '+55 21 98888-0000',
        specialty: 'Brazilian Jiu-Jitsu'
      }
    ];

    console.log('👨‍🏫 Creating 10 coaches...');
    for (const coach of coaches) {
      const password = await bcrypt.hash('GFTeamCoach2024!', 12);
      await query(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        coach.id,
        tenantId,
        coach.email,
        password,
        coach.firstName,
        coach.lastName,
        coach.phone,
        'COACH',
        'active',
        1
      ]);
      console.log(`   ✅ ${coach.firstName} ${coach.lastName} (${coach.specialty})`);
    }

    // Create 20 students
    const studentData = [
      { firstName: 'Gabriel', lastName: 'Silva', email: 'gabriel.s@email.com', phone: '+55 21 97777-1001', studentId: 'GT001', birthDate: '1995-03-15', gender: 'male', beltLevel: 'azul', isKidsStudent: false },
      { firstName: 'Isabella', lastName: 'Santos', email: 'isabella.s@email.com', phone: '+55 21 97777-1002', studentId: 'GT002', birthDate: '1998-07-22', gender: 'female', beltLevel: 'branca', isKidsStudent: false },
      { firstName: 'Lucas', lastName: 'Oliveira', email: 'lucas.o@email.com', phone: '+55 21 97777-1003', studentId: 'GT003', birthDate: '2006-11-08', gender: 'male', beltLevel: 'amarela', isKidsStudent: true },
      { firstName: 'Sophia', lastName: 'Costa', email: 'sophia.c@email.com', phone: '+55 21 97777-1004', studentId: 'GT004', birthDate: '1992-01-30', gender: 'female', beltLevel: 'roxa', isKidsStudent: false },
      { firstName: 'Mateus', lastName: 'Pereira', email: 'mateus.p@email.com', phone: '+55 21 97777-1005', studentId: 'GT005', birthDate: '2004-05-12', gender: 'male', beltLevel: 'laranja', isKidsStudent: true },
      { firstName: 'Lara', lastName: 'Rodrigues', email: 'lara.r@email.com', phone: '+55 21 97777-1006', studentId: 'GT006', birthDate: '1997-09-18', gender: 'female', beltLevel: 'azul', isKidsStudent: false },
      { firstName: 'Enzo', lastName: 'Almeida', email: 'enzo.a@email.com', phone: '+55 21 97777-1007', studentId: 'GT007', birthDate: '2008-12-03', gender: 'male', beltLevel: 'branca', isKidsStudent: true },
      { firstName: 'Valentina', lastName: 'Lima', email: 'valentina.l@email.com', phone: '+55 21 97777-1008', studentId: 'GT008', birthDate: '1994-04-25', gender: 'female', beltLevel: 'marrom', isKidsStudent: false },
      { firstName: 'Arthur', lastName: 'Mendes', email: 'arthur.m@email.com', phone: '+55 21 97777-1009', studentId: 'GT009', birthDate: '2005-08-14', gender: 'male', beltLevel: 'verde', isKidsStudent: true },
      { firstName: 'Helena', lastName: 'Barbosa', email: 'helena.b@email.com', phone: '+55 21 97777-1010', studentId: 'GT010', birthDate: '1996-06-07', gender: 'female', beltLevel: 'branca', isKidsStudent: false },
      { firstName: 'Davi', lastName: 'Nascimento', email: 'davi.n@email.com', phone: '+55 21 97777-1011', studentId: 'GT011', birthDate: '2007-10-20', gender: 'male', beltLevel: 'amarela-branca', isKidsStudent: true },
      { firstName: 'Alice', lastName: 'Vieira', email: 'alice.v@email.com', phone: '+55 21 97777-1012', studentId: 'GT012', birthDate: '1993-02-11', gender: 'female', beltLevel: 'azul', isKidsStudent: false },
      { firstName: 'Miguel', lastName: 'Fernandes', email: 'miguel.f@email.com', phone: '+55 21 97777-1013', studentId: 'GT013', birthDate: '2009-01-16', gender: 'male', beltLevel: 'cinza', isKidsStudent: true },
      { firstName: 'Laura', lastName: 'Cavalcanti', email: 'laura.c@email.com', phone: '+55 21 97777-1014', studentId: 'GT014', birthDate: '1991-12-29', gender: 'female', beltLevel: 'preta', isKidsStudent: false },
      { firstName: 'Bernardo', lastName: 'Gomes', email: 'bernardo.g@email.com', phone: '+55 21 97777-1015', studentId: 'GT015', birthDate: '2003-07-05', gender: 'male', beltLevel: 'laranja-branca', isKidsStudent: true },
      { firstName: 'Manuela', lastName: 'Martins', email: 'manuela.m@email.com', phone: '+55 21 97777-1016', studentId: 'GT016', birthDate: '1999-03-28', gender: 'female', beltLevel: 'roxa', isKidsStudent: false },
      { firstName: 'Samuel', lastName: 'Rocha', email: 'samuel.r@email.com', phone: '+55 21 97777-1017', studentId: 'GT017', birthDate: '2006-11-12', gender: 'male', beltLevel: 'verde-branca', isKidsStudent: true },
      { firstName: 'Beatriz', lastName: 'Cardoso', email: 'beatriz.c@email.com', phone: '+55 21 97777-1018', studentId: 'GT018', birthDate: '1995-05-19', gender: 'female', beltLevel: 'branca', isKidsStudent: false },
      { firstName: 'Heitor', lastName: 'Rezende', email: 'heitor.r@email.com', phone: '+55 21 97777-1019', studentId: 'GT019', birthDate: '2004-09-02', gender: 'male', beltLevel: 'amarela', isKidsStudent: true },
      { firstName: 'Lívia', lastName: 'Araújo', email: 'livia.a@email.com', phone: '+55 21 97777-1020', studentId: 'GT020', birthDate: '1998-08-15', gender: 'female', beltLevel: 'azul', isKidsStudent: false }
    ];

    console.log('👥 Creating 20 students...');
    for (const student of studentData) {
      const userId = uuidv4();
      const password = await bcrypt.hash('GFTeamStudent2024!', 12);
      
      // Create user account
      await query(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        tenantId,
        student.email,
        password,
        student.firstName,
        student.lastName,
        student.phone,
        'STUDENT',
        'active',
        1
      ]);

      // Create student profile
      await query(`
        INSERT INTO students (
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
        `${student.firstName} ${student.lastName} Contato de Emergência`,
        student.phone.replace(student.phone.slice(-4), '9999'),
        student.beltLevel,
        student.isKidsStudent ? 1 : 0,
        1
      ]);

      console.log(`   ✅ ${student.studentId}: ${student.firstName} ${student.lastName} (${student.beltLevel})`);
    }

    console.log('🎉 GFTeam Tubarão Academy setup completed successfully!');
    console.log('\n📋 Academy Summary:');
    console.log(`🏢 Academy: ${academyDetails.name}`);
    console.log(`🌐 Domain: ${academyDetails.domain}`);
    console.log(`📧 Contact: ${academyDetails.contactEmail}`);
    console.log(`📅 License: ${academyDetails.plan} (expires: ${licenseEnd.toLocaleDateString()})`);
    console.log(`👥 Users Created:`);
    console.log(`   👤 System Manager: admin@tubaraobjj.com (GFTeamAdmin2024!)`);
    console.log(`   👤 Branch Managers: 3 managers created (GFTeamManager2024!)`);
    console.log(`   👨‍🏫 Coaches: 10 coaches created (GFTeamCoach2024!)`);
    console.log(`   👥 Students: 20 students created (GFTeamStudent2024!)`);
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
  createGFTeamTubaraoSimple()
    .then(() => {
      console.log('🎉 GFTeam Tubarão Academy created successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Academy creation failed:', error);
      process.exit(1);
    });
}

export default createGFTeamTubaraoSimple;

