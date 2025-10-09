import pgPromise from 'pg-promise';

const pgp = pgPromise();
const dbConfig = {
  host: 'ep-steep-tooth-ac14qe2b-pooler.sa-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_5NJmWgEc4rtU',
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const db = pgp(dbConfig);

async function addLicenseLimits() {
  try {
    console.log('🔄 Adding license_limits column to tenants table...');
    
    // Add license_limits column if it doesn't exist
    await db.none(`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS license_limits JSONB DEFAULT '{
        "students": 100,
        "coaches": 5,
        "branches": 1,
        "classes": 50,
        "championships": 10,
        "weight_divisions": 20,
        "fight_modalities": 10,
        "affiliations": 5
      }'::jsonb
    `);
    
    console.log('✅ license_limits column added successfully');
    
    // Update existing tenants with default limits based on their plan
    console.log('🔄 Updating existing tenants with plan-based limits...');
    
    const tenants = await db.any('SELECT id, plan FROM tenants');
    
    for (const tenant of tenants) {
      let limits;
      
      switch (tenant.plan) {
        case 'trial':
          limits = {
            students: 25,
            coaches: 2,
            branches: 1,
            classes: 10,
            championships: 2,
            weight_divisions: 10,
            fight_modalities: 5,
            affiliations: 2
          };
          break;
        case 'basic':
          limits = {
            students: 100,
            coaches: 5,
            branches: 2,
            classes: 50,
            championships: 10,
            weight_divisions: 20,
            fight_modalities: 10,
            affiliations: 5
          };
          break;
        case 'professional':
          limits = {
            students: 500,
            coaches: 15,
            branches: 5,
            classes: 200,
            championships: 50,
            weight_divisions: 50,
            fight_modalities: 25,
            affiliations: 15
          };
          break;
        case 'enterprise':
          limits = {
            students: -1, // Unlimited
            coaches: -1,
            branches: -1,
            classes: -1,
            championships: -1,
            weight_divisions: -1,
            fight_modalities: -1,
            affiliations: -1
          };
          break;
        default:
          limits = {
            students: 100,
            coaches: 5,
            branches: 1,
            classes: 50,
            championships: 10,
            weight_divisions: 20,
            fight_modalities: 10,
            affiliations: 5
          };
      }
      
      await db.none(
        'UPDATE tenants SET license_limits = $1 WHERE id = $2',
        [JSON.stringify(limits), tenant.id]
      );
      
      console.log(`✅ Updated tenant ${tenant.id} (${tenant.plan}) with limits:`, limits);
    }
    
    console.log('🎉 License limits migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.$pool.end();
  }
}

// Run migration
addLicenseLimits().catch(console.error);
