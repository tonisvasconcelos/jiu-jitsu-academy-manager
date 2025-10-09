"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const sqlite_database_1 = require("../config/sqlite-database");
const types_1 = require("../types");
async function createGFTeamTubarao() {
    try {
        console.log('🥊 Creating GFTeam Tubarão Academy...');
        await (0, sqlite_database_1.testConnection)();
        const academyDetails = {
            name: 'GFTeam Tubarão',
            domain: 'tubaraobjj.com',
            contactEmail: 'marciotubaraobjj@gmail.com',
            contactPhone: '+55 21 97366-8820',
            address: 'R. Teodoro da Silva, 725 - Vila Isabel, Rio de Janeiro - RJ, 20560-060',
            plan: types_1.LicensePlan.ENTERPRISE,
            licenseDays: 365
        };
        const tenantId = (0, uuid_1.v4)();
        const licenseStart = new Date();
        const licenseEnd = new Date(Date.now() + academyDetails.licenseDays * 24 * 60 * 60 * 1000);
        await (0, sqlite_database_1.query)(`
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
            true,
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
        const tenant = { id: tenantId, name: academyDetails.name, domain: academyDetails.domain, plan: academyDetails.plan };
        console.log('✅ Created tenant:', tenant.name);
        console.log(`   Domain: ${tenant.domain}`);
        console.log(`   License: ${tenant.plan} (expires: ${licenseEnd.toLocaleDateString()})`);
        const branches = [
            {
                id: (0, uuid_1.v4)(),
                name: 'Sede Vila Isabel',
                address: academyDetails.address,
                city: 'Rio de Janeiro',
                state: 'RJ',
                country: 'Brazil',
                postalCode: '20560-060',
                phone: academyDetails.contactPhone,
                email: academyDetails.contactEmail,
                capacity: 60,
                facilities: ['Área Principal de Treino', 'Vestiários', 'Estacionamento', 'Recepção', 'Armazenamento de Equipamentos', 'Área de Aquecimento']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Filial Copacabana',
                address: 'Av. Atlântica, 1234 - Copacabana, Rio de Janeiro - RJ, 22070-011',
                city: 'Rio de Janeiro',
                state: 'RJ',
                country: 'Brazil',
                postalCode: '22070-011',
                phone: '+55 21 98765-4321',
                email: 'copacabana@tubaraobjj.com',
                capacity: 40,
                facilities: ['Área de Treino', 'Vestiários', 'Recepção', 'Armazenamento']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Filial Barra da Tijuca',
                address: 'Av. das Américas, 5678 - Barra da Tijuca, Rio de Janeiro - RJ, 22640-100',
                city: 'Rio de Janeiro',
                state: 'RJ',
                country: 'Brazil',
                postalCode: '22640-100',
                phone: '+55 21 99876-5432',
                email: 'barra@tubaraobjj.com',
                capacity: 50,
                facilities: ['Área de Treino', 'Vestiários', 'Estacionamento', 'Recepção', 'Área de Aquecimento']
            }
        ];
        console.log('🏢 Creating 3 branches...');
        for (const branchData of branches) {
            const branch = await db.one(`
        INSERT INTO branches (
          id, tenant_id, name, address, city, state, country, 
          postal_code, phone, email, is_active, 
          capacity, facilities, coordinates
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
                branchData.id,
                tenantId,
                branchData.name,
                branchData.address,
                branchData.city,
                branchData.state,
                branchData.country,
                branchData.postalCode,
                branchData.phone,
                branchData.email,
                true,
                branchData.capacity,
                branchData.facilities,
                JSON.stringify({
                    latitude: -22.9068,
                    longitude: -43.1729
                })
            ]);
            console.log(`   ✅ ${branch.name} (${branch.capacity} capacity)`);
        }
        const systemManagerId = (0, uuid_1.v4)();
        const systemManagerPassword = await bcryptjs_1.default.hash('GFTeamAdmin2024!', 12);
        const systemManager = await db.one(`
      INSERT INTO users (
        id, tenant_id, email, password_hash, first_name, last_name,
        phone, role, status, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
            systemManagerId,
            tenantId,
            'admin@tubaraobjj.com',
            systemManagerPassword,
            'Márcio',
            'Tubarão',
            academyDetails.contactPhone,
            types_1.UserRole.SYSTEM_MANAGER,
            types_1.UserStatus.ACTIVE,
            true
        ]);
        console.log('✅ Created system manager:', systemManager.email);
        const branchManagers = [
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Carlos',
                lastName: 'Silva',
                email: 'carlos@tubaraobjj.com',
                phone: '+55 21 99999-1111',
                branchId: branches[0].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Ana',
                lastName: 'Santos',
                email: 'ana@tubaraobjj.com',
                phone: '+55 21 99999-2222',
                branchId: branches[1].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Roberto',
                lastName: 'Oliveira',
                email: 'roberto@tubaraobjj.com',
                phone: '+55 21 99999-3333',
                branchId: branches[2].id
            }
        ];
        console.log('👥 Creating 3 branch managers...');
        for (const manager of branchManagers) {
            const password = await bcryptjs_1.default.hash('GFTeamManager2024!', 12);
            const branchManager = await db.one(`
        INSERT INTO users (
          id, tenant_id, email, password_hash, first_name, last_name,
          phone, role, status, branch_id, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
                manager.id,
                tenantId,
                manager.email,
                password,
                manager.firstName,
                manager.lastName,
                manager.phone,
                types_1.UserRole.BRANCH_MANAGER,
                types_1.UserStatus.ACTIVE,
                manager.branchId,
                true
            ]);
            await db.none('UPDATE branches SET manager_id = $1 WHERE id = $2', [manager.id, manager.branchId]);
            console.log(`   ✅ ${manager.firstName} ${manager.lastName} - ${branches.find(b => b.id === manager.branchId)?.name}`);
        }
        const coaches = [
            {
                id: (0, uuid_1.v4)(),
                firstName: 'João',
                lastName: 'Pereira',
                email: 'joao@tubaraobjj.com',
                phone: '+55 21 98888-1111',
                specialty: 'Brazilian Jiu-Jitsu',
                branchId: branches[0].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Maria',
                lastName: 'Fernandes',
                email: 'maria@tubaraobjj.com',
                phone: '+55 21 98888-2222',
                specialty: 'Brazilian Jiu-Jitsu',
                branchId: branches[0].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Pedro',
                lastName: 'Costa',
                email: 'pedro@tubaraobjj.com',
                phone: '+55 21 98888-3333',
                specialty: 'Muay Thai',
                branchId: branches[0].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Lucia',
                lastName: 'Rodrigues',
                email: 'lucia@tubaraobjj.com',
                phone: '+55 21 98888-4444',
                specialty: 'Brazilian Jiu-Jitsu',
                branchId: branches[1].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Rafael',
                lastName: 'Almeida',
                email: 'rafael@tubaraobjj.com',
                phone: '+55 21 98888-5555',
                specialty: 'Boxing',
                branchId: branches[1].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Fernanda',
                lastName: 'Lima',
                email: 'fernanda@tubaraobjj.com',
                phone: '+55 21 98888-6666',
                specialty: 'Brazilian Jiu-Jitsu',
                branchId: branches[1].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Diego',
                lastName: 'Mendes',
                email: 'diego@tubaraobjj.com',
                phone: '+55 21 98888-7777',
                specialty: 'Muay Thai',
                branchId: branches[2].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Camila',
                lastName: 'Barbosa',
                email: 'camila@tubaraobjj.com',
                phone: '+55 21 98888-8888',
                specialty: 'Brazilian Jiu-Jitsu',
                branchId: branches[2].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Thiago',
                lastName: 'Nascimento',
                email: 'thiago@tubaraobjj.com',
                phone: '+55 21 98888-9999',
                specialty: 'Boxing',
                branchId: branches[2].id
            },
            {
                id: (0, uuid_1.v4)(),
                firstName: 'Juliana',
                lastName: 'Vieira',
                email: 'juliana@tubaraobjj.com',
                phone: '+55 21 98888-0000',
                specialty: 'Brazilian Jiu-Jitsu',
                branchId: branches[0].id
            }
        ];
        console.log('👨‍🏫 Creating 10 coaches...');
        for (const coach of coaches) {
            const password = await bcryptjs_1.default.hash('GFTeamCoach2024!', 12);
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
                types_1.UserRole.COACH,
                types_1.UserStatus.ACTIVE,
                coach.branchId,
                true
            ]);
            console.log(`   ✅ ${coach.firstName} ${coach.lastName} (${coach.specialty}) - ${branches.find(b => b.id === coach.branchId)?.name}`);
        }
        const studentData = [
            { firstName: 'Gabriel', lastName: 'Silva', email: 'gabriel.s@email.com', phone: '+55 21 97777-1001', studentId: 'GT001', birthDate: '1995-03-15', gender: 'male', beltLevel: 'azul', isKidsStudent: false, branchId: branches[0].id },
            { firstName: 'Isabella', lastName: 'Santos', email: 'isabella.s@email.com', phone: '+55 21 97777-1002', studentId: 'GT002', birthDate: '1998-07-22', gender: 'female', beltLevel: 'branca', isKidsStudent: false, branchId: branches[0].id },
            { firstName: 'Lucas', lastName: 'Oliveira', email: 'lucas.o@email.com', phone: '+55 21 97777-1003', studentId: 'GT003', birthDate: '2006-11-08', gender: 'male', beltLevel: 'amarela', isKidsStudent: true, branchId: branches[0].id },
            { firstName: 'Sophia', lastName: 'Costa', email: 'sophia.c@email.com', phone: '+55 21 97777-1004', studentId: 'GT004', birthDate: '1992-01-30', gender: 'female', beltLevel: 'roxa', isKidsStudent: false, branchId: branches[0].id },
            { firstName: 'Mateus', lastName: 'Pereira', email: 'mateus.p@email.com', phone: '+55 21 97777-1005', studentId: 'GT005', birthDate: '2004-05-12', gender: 'male', beltLevel: 'laranja', isKidsStudent: true, branchId: branches[0].id },
            { firstName: 'Lara', lastName: 'Rodrigues', email: 'lara.r@email.com', phone: '+55 21 97777-1006', studentId: 'GT006', birthDate: '1997-09-18', gender: 'female', beltLevel: 'azul', isKidsStudent: false, branchId: branches[1].id },
            { firstName: 'Enzo', lastName: 'Almeida', email: 'enzo.a@email.com', phone: '+55 21 97777-1007', studentId: 'GT007', birthDate: '2008-12-03', gender: 'male', beltLevel: 'branca', isKidsStudent: true, branchId: branches[1].id },
            { firstName: 'Valentina', lastName: 'Lima', email: 'valentina.l@email.com', phone: '+55 21 97777-1008', studentId: 'GT008', birthDate: '1994-04-25', gender: 'female', beltLevel: 'marrom', isKidsStudent: false, branchId: branches[1].id },
            { firstName: 'Arthur', lastName: 'Mendes', email: 'arthur.m@email.com', phone: '+55 21 97777-1009', studentId: 'GT009', birthDate: '2005-08-14', gender: 'male', beltLevel: 'verde', isKidsStudent: true, branchId: branches[1].id },
            { firstName: 'Helena', lastName: 'Barbosa', email: 'helena.b@email.com', phone: '+55 21 97777-1010', studentId: 'GT010', birthDate: '1996-06-07', gender: 'female', beltLevel: 'branca', isKidsStudent: false, branchId: branches[1].id },
            { firstName: 'Davi', lastName: 'Nascimento', email: 'davi.n@email.com', phone: '+55 21 97777-1011', studentId: 'GT011', birthDate: '2007-10-20', gender: 'male', beltLevel: 'amarela-branca', isKidsStudent: true, branchId: branches[2].id },
            { firstName: 'Alice', lastName: 'Vieira', email: 'alice.v@email.com', phone: '+55 21 97777-1012', studentId: 'GT012', birthDate: '1993-02-11', gender: 'female', beltLevel: 'azul', isKidsStudent: false, branchId: branches[2].id },
            { firstName: 'Miguel', lastName: 'Fernandes', email: 'miguel.f@email.com', phone: '+55 21 97777-1013', studentId: 'GT013', birthDate: '2009-01-16', gender: 'male', beltLevel: 'cinza', isKidsStudent: true, branchId: branches[2].id },
            { firstName: 'Laura', lastName: 'Cavalcanti', email: 'laura.c@email.com', phone: '+55 21 97777-1014', studentId: 'GT014', birthDate: '1991-12-29', gender: 'female', beltLevel: 'preta', isKidsStudent: false, branchId: branches[2].id },
            { firstName: 'Bernardo', lastName: 'Gomes', email: 'bernardo.g@email.com', phone: '+55 21 97777-1015', studentId: 'GT015', birthDate: '2003-07-05', gender: 'male', beltLevel: 'laranja-branca', isKidsStudent: true, branchId: branches[0].id },
            { firstName: 'Manuela', lastName: 'Martins', email: 'manuela.m@email.com', phone: '+55 21 97777-1016', studentId: 'GT016', birthDate: '1999-03-28', gender: 'female', beltLevel: 'roxa', isKidsStudent: false, branchId: branches[0].id },
            { firstName: 'Samuel', lastName: 'Rocha', email: 'samuel.r@email.com', phone: '+55 21 97777-1017', studentId: 'GT017', birthDate: '2006-11-12', gender: 'male', beltLevel: 'verde-branca', isKidsStudent: true, branchId: branches[1].id },
            { firstName: 'Beatriz', lastName: 'Cardoso', email: 'beatriz.c@email.com', phone: '+55 21 97777-1018', studentId: 'GT018', birthDate: '1995-05-19', gender: 'female', beltLevel: 'branca', isKidsStudent: false, branchId: branches[1].id },
            { firstName: 'Heitor', lastName: 'Rezende', email: 'heitor.r@email.com', phone: '+55 21 97777-1019', studentId: 'GT019', birthDate: '2004-09-02', gender: 'male', beltLevel: 'amarela', isKidsStudent: true, branchId: branches[2].id },
            { firstName: 'Lívia', lastName: 'Araújo', email: 'livia.a@email.com', phone: '+55 21 97777-1020', studentId: 'GT020', birthDate: '1998-08-15', gender: 'female', beltLevel: 'azul', isKidsStudent: false, branchId: branches[2].id }
        ];
        console.log('👥 Creating 20 students...');
        for (const student of studentData) {
            const userId = (0, uuid_1.v4)();
            const password = await bcryptjs_1.default.hash('GFTeamStudent2024!', 12);
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
                types_1.UserRole.STUDENT,
                types_1.UserStatus.ACTIVE,
                student.branchId,
                true
            ]);
            await db.one(`
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
                `${student.firstName} ${student.lastName} Contato de Emergência`,
                student.phone.replace(student.phone.slice(-4), '9999'),
                student.beltLevel,
                student.isKidsStudent,
                true
            ]);
            const branchName = branches.find(b => b.id === student.branchId)?.name || 'Unknown';
            console.log(`   ✅ ${student.studentId}: ${student.firstName} ${student.lastName} (${student.beltLevel}) - ${branchName}`);
        }
        const now = new Date();
        const classes = [
            {
                name: 'BJJ Iniciantes',
                description: 'Fundamentos do Brazilian Jiu-Jitsu',
                coachId: coaches[0].id,
                modality: 'Brazilian Jiu-Jitsu',
                branchId: branches[0].id,
                startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
                maxCapacity: 25,
                price: 50.00
            },
            {
                name: 'BJJ Avançado',
                description: 'Técnicas avançadas e sparring',
                coachId: coaches[1].id,
                modality: 'Brazilian Jiu-Jitsu',
                branchId: branches[0].id,
                startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
                maxCapacity: 20,
                price: 60.00
            },
            {
                name: 'BJJ Kids',
                description: 'BJJ divertido e seguro para crianças',
                coachId: coaches[0].id,
                modality: 'Brazilian Jiu-Jitsu',
                branchId: branches[0].id,
                startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
                maxCapacity: 15,
                price: 40.00
            },
            {
                name: 'Muay Thai',
                description: 'Aprenda a arte das oito armas',
                coachId: coaches[2].id,
                modality: 'Muay Thai',
                branchId: branches[1].id,
                startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
                maxCapacity: 20,
                price: 55.00
            },
            {
                name: 'Boxe',
                description: 'Técnicas fundamentais de boxe e condicionamento',
                coachId: coaches[4].id,
                modality: 'Boxing',
                branchId: branches[2].id,
                startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
                endTime: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
                maxCapacity: 18,
                price: 50.00
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
                (0, uuid_1.v4)(),
                tenantId,
                cls.name,
                cls.description,
                cls.branchId,
                cls.coachId,
                cls.modality,
                cls.startTime,
                cls.endTime,
                cls.maxCapacity,
                0,
                types_1.ClassStatus.SCHEDULED,
                cls.price
            ]);
            const branchName = branches.find(b => b.id === cls.branchId)?.name || 'Unknown';
            console.log(`   ✅ ${cls.name} - ${cls.modality} (R$ ${cls.price}) - ${branchName}`);
        }
        await db.one(`
      INSERT INTO subscriptions (
        id, tenant_id, plan, status, current_period_start, current_period_end
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
            (0, uuid_1.v4)(),
            tenantId,
            academyDetails.plan,
            'active',
            licenseStart,
            licenseEnd
        ]);
        console.log('🎉 GFTeam Tubarão Academy setup completed successfully!');
        console.log('\n📋 Academy Summary:');
        console.log(`🏢 Academy: ${academyDetails.name}`);
        console.log(`🌐 Domain: ${academyDetails.domain}`);
        console.log(`📧 Contact: ${academyDetails.contactEmail}`);
        console.log(`📅 License: ${academyDetails.plan} (expires: ${licenseEnd.toLocaleDateString()})`);
        console.log(`🏢 Branches: 3 branches created`);
        console.log(`👥 Users Created:`);
        console.log(`   👤 System Manager: admin@tubaraobjj.com (GFTeamAdmin2024!)`);
        console.log(`   👤 Branch Managers: 3 managers created (GFTeamManager2024!)`);
        console.log(`   👨‍🏫 Coaches: 10 coaches created (GFTeamCoach2024!)`);
        console.log(`   👥 Students: 20 students created (GFTeamStudent2024!)`);
        console.log(`📅 Classes: 5 sample classes created`);
        console.log('\n🔗 Access URLs:');
        console.log(`   🌐 Public Portal: http://localhost:5000/public?tenantDomain=${academyDetails.domain}`);
        console.log(`   🔐 Admin Login: http://localhost:3000/login`);
        console.log(`   📊 API Base: http://localhost:5000/api`);
    }
    catch (error) {
        console.error('❌ Academy creation failed:', error);
        throw error;
    }
}
if (require.main === module) {
    createGFTeamTubarao()
        .then(() => {
        console.log('🎉 GFTeam Tubarão Academy created successfully!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Academy creation failed:', error);
        process.exit(1);
    });
}
exports.default = createGFTeamTubarao;
//# sourceMappingURL=createGFTeamTubarao.js.map