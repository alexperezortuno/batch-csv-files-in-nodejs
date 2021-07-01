import {ServerInterface} from '../interface/server.interface';
import {DatabaseInterface} from '../interface/database.interface';
import {CronInterface} from '../interface/cron.interface';

export const SERVER: ServerInterface = {
    port: Number(process.env.PORT) || 5000,
    logLevel: process.env.LOG_LEVEL || 'debug',
    env: process.env.SERVER_ENV || 'development',
    context: process.env.CONTEXT || 'api',
}

export const DB: DatabaseInterface = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_DATABASE || 'testdb',
    password: process.env.DB_PASSWORD || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    connStr: process.env.CONN_STR || undefined,
    max: Number(process.env.DB_MAX_CLIENT) || 10,
    idleTimeoutMillis: Number(process.env.DB_TIME_OUT) || 30000,
    connectionTimeoutMillis: Number(process.env.DB_CONNECTIONS_TIME_OUT) || 2000,
}

export const SCHEDULER: CronInterface = {
    csvScheduler: process.env.CSV_SCHEDULER || '*/5 * * * *',
}
