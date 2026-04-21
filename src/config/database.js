import "dotenv/config";

import {neon, neonConfig} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-serverless";

const config = neonConfig({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(neon(config));

export default db;