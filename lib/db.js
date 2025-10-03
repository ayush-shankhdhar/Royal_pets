import { Pool } from 'pg';

const DATABASE_URL = (process.env.ENV == 'prod') ? process.env.PG_CONN_SERV : process.env.PG_CONN_DEV;
const a=5;
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'prod' ? { rejectUnauthorized: false } : false,
});

export default pool;
