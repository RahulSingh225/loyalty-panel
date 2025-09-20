import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://dbadmin:Dbadmin@123@10.0.2.213:5432/ranjit_loyalty',
  },
});