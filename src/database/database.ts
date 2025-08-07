import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types';
import config from '../config/config';

const dialect = new PostgresDialect({
  pool: new Pool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
}); 