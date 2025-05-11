const fs = require('fs');

const envContent = `DATABASE_URL=postgres://neondb_owner:npg_9i0fCLKVONsD@ep-summer-base-a4coaqvp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_9i0fCLKVONsD@ep-summer-base-a4coaqvp.us-east-1.aws.neon.tech/neondb?sslmode=require
PGHOST=ep-summer-base-a4coaqvp-pooler.us-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-summer-base-a4coaqvp.us-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_9i0fCLKVONsD
JWT_SECRET=your-secret-key-for-development
POSTGRES_URL=postgres://neondb_owner:npg_9i0fCLKVONsD@ep-summer-base-a4coaqvp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://neondb_owner:npg_9i0fCLKVONsD@ep-summer-base-a4coaqvp.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-summer-base-a4coaqvp-pooler.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_9i0fCLKVONsD
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgres://neondb_owner:npg_9i0fCLKVONsD@ep-summer-base-a4coaqvp-pooler.us-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgres://neondb_owner:npg_9i0fCLKVONsD@ep-summer-base-a4coaqvp-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require`;

fs.writeFileSync('.env.local', envContent);
console.log('.env.local file has been updated successfully.'); 