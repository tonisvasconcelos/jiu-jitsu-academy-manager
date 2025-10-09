"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const database_2 = require("../config/database");
const types_1 = require("../types");
async function seed() {
    try {
        console.log('🌱 Starting database seeding...');
        await (0, database_2.testConnection)();
        const tenantId = (0, uuid_1.v4)();
        const tenant = await database_1.default.one(`
      INSERT INTO tenants (
        id, name, domain, plan, license_start, license_end, 
        is_active, contact_email, contact_phone, address, settings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
            tenantId,
            'Demo Jiu-Jitsu Academy',
            'demo.jiu-jitsu.com',
            types_1.LicensePlan.PROFESSIONAL,
            new Date(),
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            true,
            'contact@demo-jiu-jitsu.com',
            '+1-555-0123',
            '123 Martial Arts Street, Combat City, CC 12345',
            JSON.stringify({
                timezone: 'America/New_York',
                currency: 'USD',
                language: 'ENU',
                features: {
                    publicBooking: true,
                    classScheduling: true,
                    studentManagement: true,
                    championshipManagement: true
                }
            })
        ]);
        console.log('✅ Created tenant:', tenant.name);
        const branchId = (0, uuid_1.v4)();
        const branch = await database_1.default.one(`
      INSERT INTO branches (
        id, tenant_id, name, address, city, state, country, 
        postal_code, phone, email, manager_id, is_active, 
        capacity, facilities, coordinates
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
            branchId,
            tenantId,
            'Main Dojo',
            '123 Martial Arts Street',
            'Combat City',
            'CC',
            'USA',
            '12345',
            '+1-555-0123',
            'main@demo-jiu-jitsu.com',
            null,
            true,
            50,
            ['Main Training Area', 'Changing Rooms', 'Parking', 'Reception'],
            JSON.stringify({
                latitude: 40.7128,
                longitude: -74.0060
            })
        ]);
        console.log('✅ Created branch:', branch.name);
        const systemManagerId = (0, uuid_1.v4)();
        const systemManagerPassword = await bcryptjs_1.default.hash('password123', 12);
        const systemManager = await database_1.default.one(`
      INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
            systemManagerId,
            tenantId,
            'admin@demo-jiu-jitsu.com',
            systemManagerPassword,
            'System',
            'Administrator',
            '+1-555-0001',
            types_1.UserRole.SYSTEM_MANAGER,
            types_1.UserStatus.ACTIVE,
            true
        ]);
        console.log('✅ Created system manager:', systemManager.email);
        const branchManagerId = (0, uuid_1.v4)();
        const branchManagerPassword = await bcryptjs_1.default.hash('password123', 12);
        const branchManager = await database_1.default.one(`
      INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, branch_id, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
            branchManagerId,
            tenantId,
            'manager@demo-jiu-jitsu.com',
            branchManagerPassword,
            'Branch',
            'Manager',
            '+1-555-0002',
            types_1.UserRole.BRANCH_MANAGER,
            types_1.UserStatus.ACTIVE,
            branchId,
            true
        ]);
        console.log('✅ Created branch manager:', branchManager.email);
        await database_1.default.none('UPDATE branches SET manager_id = $1 WHERE id = $2', [branchManagerId, branchId]);
        const coaches = [
            {
                id: (0, uuid_1.v4)(),
                firstName: 'John',
                lastName: 'Black Belt',
                email: 'john@demo-jiu-jitsu.com',
                phone: '+1-555-0003'
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Sarah',
                lastName: 'Martial Arts',
                email: 'sarah@demo-jiu-jitsu.com',
                phone: '+1-555-0004'
            }
        ];
        for (const coach of coaches) {
            const password = await bcryptjs_1.default.hash('password123', 12);
            await database_1.default.one(`
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
                types_1.UserRole.COACH,
                types_1.UserStatus.ACTIVE,
                branchId,
                true
            ]);
            console.log('✅ Created coach:', coach.email);
        }
        const students = [
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Alice',
                lastName: 'Student',
                email: 'alice@demo-jiu-jitsu.com',
                phone: '+1-555-0005',
                studentId: 'STU001',
                birthDate: '1995-03-15',
                gender: 'female',
                beltLevel: 'blue',
                isKidsStudent: false
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Bob',
                lastName: 'Beginner',
                email: 'bob@demo-jiu-jitsu.com',
                phone: '+1-555-0006',
                studentId: 'STU002',
                birthDate: '2005-08-22',
                gender: 'male',
                beltLevel: 'white',
                isKidsStudent: true
            }
        ];
        for (const student of students) {
            const password = await bcryptjs_1.default.hash('password123', 12);
            const user = await database_1.default.one(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, branch_id, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
                student.id,
                tenantId,
                student.email,
                password,
                student.firstName,
                student.lastName,
                student.phone,
                types_1.UserRole.STUDENT,
                types_1.UserStatus.ACTIVE,
                branchId,
                true
            ]);
            await database_1.default.one(`
        INSERT INTO students (
          id, tenant_id, user_id, student_id, birth_date, gender,
          emergency_contact_name, emergency_contact_phone, belt_level,
          is_kids_student, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
                (0, uuid_1.v4)(),
                tenantId,
                user.id,
                student.studentId,
                student.birthDate,
                student.gender,
                'Emergency Contact',
                '+1-555-9999',
                student.beltLevel,
                student.isKidsStudent,
                true
            ]);
            console.log('✅ Created student:', student.email);
        }
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        const classes = [
            {
                id: (0, uuid_1.v4)(),
                name: 'Beginner BJJ',
                description: 'Introduction to Brazilian Jiu-Jitsu fundamentals',
                coachId: coaches[0].id,
                modality: 'Brazilian Jiu-Jitsu',
                startTime: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000),
                endTime: new Date(tomorrow.getTime() + 19 * 60 * 60 * 1000),
                maxCapacity: 20,
                price: 25.00
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Advanced BJJ',
                description: 'Advanced techniques and sparring',
                coachId: coaches[1].id,
                modality: 'Brazilian Jiu-Jitsu',
                startTime: new Date(dayAfter.getTime() + 19 * 60 * 60 * 1000),
                endTime: new Date(dayAfter.getTime() + 20 * 60 * 60 * 1000),
                maxCapacity: 15,
                price: 30.00
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Kids BJJ',
                description: 'Fun and safe BJJ for children',
                coachId: coaches[0].id,
                modality: 'Brazilian Jiu-Jitsu',
                startTime: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000),
                endTime: new Date(tomorrow.getTime() + 17 * 60 * 60 * 1000),
                maxCapacity: 12,
                price: 20.00
            }
        ];
        for (const cls of classes) {
            await database_1.default.one(`
        INSERT INTO classes (
          id, tenant_id, name, description, branch_id, coach_id,
          modality, start_time, end_time, max_capacity, current_enrollment,
          status, price
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
                cls.id,
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
                types_1.ClassStatus.SCHEDULED,
                cls.price
            ]);
            console.log('✅ Created class:', cls.name);
        }
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Sample Data Created:');
        console.log('👤 System Manager: admin@demo-jiu-jitsu.com (password: password123)');
        console.log('👤 Branch Manager: manager@demo-jiu-jitsu.com (password: password123)');
        console.log('👤 Coach 1: john@demo-jiu-jitsu.com (password: password123)');
        console.log('👤 Coach 2: sarah@demo-jiu-jitsu.com (password: password123)');
        console.log('👤 Student 1: alice@demo-jiu-jitsu.com (password: password123)');
        console.log('👤 Student 2: bob@demo-jiu-jitsu.com (password: password123)');
        console.log('🏢 Tenant Domain: demo.jiu-jitsu.com');
        console.log('🏢 Branch: Main Dojo');
        console.log('📅 Classes: 3 sample classes created');
        console.log('\n🌐 Public Portal: http://localhost:5000/public');
        console.log('🔗 API Base: http://localhost:5000/api');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}
if (require.main === module) {
    seed()
        .then(() => {
        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });
}
exports.default = seed;
//# sourceMappingURL=seed.js.map