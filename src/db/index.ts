import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

class OfflinePool extends Pool {
  constructor() {
    super({
      // Set unreachable dummy config so it never attempts default local sockets
      host: '0.0.0.0',
      port: 1,
      connectionTimeoutMillis: 100,
    });
  }
  override async connect(): Promise<any> {
    throw new Error('DATABASE_NOT_CONFIGURED: No DATABASE_URL or SQL credentials configured.');
  }
  override async query(): Promise<any> {
    throw new Error('DATABASE_NOT_CONFIGURED: No DATABASE_URL or SQL credentials configured.');
  }
}

export const isDatabaseConfigured = (): boolean => {
  return Boolean(
    process.env.DATABASE_URL ||
    (process.env.SQL_HOST && process.env.SQL_USER)
  );
};

let _isDbConnected: boolean = false;
let _connectionChecked: boolean = false;

export const createPool = (): Pool => {
  if (!global._postgresPool) {
    if (!isDatabaseConfigured()) {
      global._postgresPool = new OfflinePool();
      return global._postgresPool;
    }

    if (process.env.DATABASE_URL) {
      global._postgresPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        connectionTimeoutMillis: 5000,
      });
    } else {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME || 'postgres',
        max: 10,
        connectionTimeoutMillis: 5000,
      });
    }

    global._postgresPool.on('error', (err) => {
      console.warn('[SQL Pool notice]:', err.message || err);
    });
  }
  return global._postgresPool;
};

export const testDatabaseConnection = async (): Promise<boolean> => {
  if (!isDatabaseConfigured()) {
    _isDbConnected = false;
    _connectionChecked = true;
    return false;
  }

  const pool = createPool();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      _isDbConnected = true;
      _connectionChecked = true;
      return true;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('[Database] Connection check failed:', err.message || err);
    _isDbConnected = false;
    _connectionChecked = true;
    return false;
  }
};

export const isDatabaseAvailable = (): boolean => {
  return _isDbConnected;
};

export const hasCheckedConnection = (): boolean => {
  return _connectionChecked;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
