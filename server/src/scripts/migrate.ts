import db from '../config/database';
import { testConnection } from '../config/database';

/**
 * Database migration script
 * Creates all tables with proper multi-tenancy and RLS setup
 */
async function migrate(): Promise<void> {
  try {
    console.log('🚀 Starting database migration...');
    
    // Test connection first
    await testConnection();

    // Create extensions
    await db.none(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // Create custom types
    await db.none(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('student', 'coach', 'branch_manager', 'system_manager');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE license_plan AS ENUM ('trial', 'basic', 'professional', 'enterprise');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE class_status AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE enrollment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE check_in_status AS ENUM ('present', 'absent', 'late', 'excused');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create tenants table
    await db.none(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE NOT NULL,
        plan license_plan NOT NULL DEFAULT 'trial',
        license_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        license_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
        is_active BOOLEAN NOT NULL DEFAULT true,
        settings JSONB DEFAULT '{}',
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        address TEXT,
        logo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create branches table
    await db.none(`
      CREATE TABLE IF NOT EXISTS branches (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        manager_id UUID,
        is_active BOOLEAN NOT NULL DEFAULT true,
        capacity INTEGER NOT NULL DEFAULT 50,
        facilities TEXT[] DEFAULT '{}',
        coordinates JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create users table
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        role user_role NOT NULL,
        status user_status NOT NULL DEFAULT 'pending',
        branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
        avatar_url TEXT,
        last_login TIMESTAMP WITH TIME ZONE,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tenant_id, email)
      );
    `);

    // Create students table
    await db.none(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        student_id VARCHAR(50) NOT NULL,
        birth_date DATE NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
        emergency_contact_name VARCHAR(255) NOT NULL,
        emergency_contact_phone VARCHAR(50) NOT NULL,
        medical_notes TEXT,
        belt_level VARCHAR(50) NOT NULL,
        is_kids_student BOOLEAN NOT NULL DEFAULT false,
        weight DECIMAL(5,2),
        weight_division_id UUID,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tenant_id, student_id)
      );
    `);

    // Create classes table
    await db.none(`
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        modality VARCHAR(100) NOT NULL,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        max_capacity INTEGER NOT NULL DEFAULT 20,
        current_enrollment INTEGER NOT NULL DEFAULT 0,
        status class_status NOT NULL DEFAULT 'scheduled',
        recurring_pattern VARCHAR(50),
        price DECIMAL(10,2),
        requirements TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create enrollments table
    await db.none(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        status enrollment_status NOT NULL DEFAULT 'pending',
        enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(student_id, class_id)
      );
    `);

    // Create check_ins table
    await db.none(`
      CREATE TABLE IF NOT EXISTS check_ins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status check_in_status NOT NULL DEFAULT 'present',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create student_modalities table
    await db.none(`
      CREATE TABLE IF NOT EXISTS student_modalities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        modality VARCHAR(100) NOT NULL,
        belt_level VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        is_active BOOLEAN NOT NULL DEFAULT true,
        progress_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create bookings table (for public bookings)
    await db.none(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        notes TEXT,
        preferred_contact_method VARCHAR(10) NOT NULL DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create subscriptions table
    await db.none(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        plan license_plan NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
        current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        stripe_subscription_id VARCHAR(255),
        mercado_pago_subscription_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for better performance
    await db.none(`
      CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
      CREATE INDEX IF NOT EXISTS idx_branches_tenant_id ON branches(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_students_tenant_id ON students(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
      CREATE INDEX IF NOT EXISTS idx_classes_tenant_id ON classes(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_classes_branch_id ON classes(branch_id);
      CREATE INDEX IF NOT EXISTS idx_classes_coach_id ON classes(coach_id);
      CREATE INDEX IF NOT EXISTS idx_classes_start_time ON classes(start_time);
      CREATE INDEX IF NOT EXISTS idx_enrollments_tenant_id ON enrollments(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
      CREATE INDEX IF NOT EXISTS idx_check_ins_tenant_id ON check_ins(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_check_ins_student_id ON check_ins(student_id);
      CREATE INDEX IF NOT EXISTS idx_check_ins_class_id ON check_ins(class_id);
      CREATE INDEX IF NOT EXISTS idx_student_modalities_tenant_id ON student_modalities(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_student_modalities_student_id ON student_modalities(student_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON bookings(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_class_id ON bookings(class_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
    `);

    // Enable Row Level Security (RLS) on all tables
    await db.none(`
      ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE students ENABLE ROW LEVEL SECURITY;
      ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
      ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
      ALTER TABLE student_modalities ENABLE ROW LEVEL SECURITY;
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policies for tenant isolation
    await createRLSPolicies();

    // Create triggers for updated_at timestamps
    await createUpdateTriggers();

    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Create Row Level Security policies for multi-tenancy
 */
async function createRLSPolicies(): Promise<void> {
  console.log('🔒 Creating RLS policies...');

  const tables = [
    'tenants', 'branches', 'users', 'students', 'classes', 
    'enrollments', 'check_ins', 'student_modalities', 'bookings', 'subscriptions'
  ];

  for (const table of tables) {
    // Drop existing policies if they exist
    await db.none(`DROP POLICY IF EXISTS tenant_isolation_policy ON ${table};`);
    
    // Create tenant isolation policy
    await db.none(`
      CREATE POLICY tenant_isolation_policy ON ${table}
      FOR ALL
      TO PUBLIC
      USING (tenant_id = current_setting('current_tenant_id')::uuid);
    `);
  }

  // Special policy for tenants table - users can only see their own tenant
  await db.none(`
    DROP POLICY IF EXISTS tenant_self_policy ON tenants;
    CREATE POLICY tenant_self_policy ON tenants
    FOR ALL
    TO PUBLIC
    USING (id = current_setting('current_tenant_id')::uuid);
  `);
}

/**
 * Create triggers for automatic updated_at timestamps
 */
async function createUpdateTriggers(): Promise<void> {
  console.log('⏰ Creating update triggers...');

  const tables = [
    'tenants', 'branches', 'users', 'students', 'classes', 
    'enrollments', 'check_ins', 'student_modalities', 'bookings', 'subscriptions'
  ];

  // Create the trigger function if it doesn't exist
  await db.none(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create triggers for each table
  for (const table of tables) {
    await db.none(`
      DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
      CREATE TRIGGER update_${table}_updated_at
      BEFORE UPDATE ON ${table}
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default migrate;
