import pgk from 'pg'
// import { PoolClient, Pool, QueryResult } from 'pg';
import {DB} from '../global/environment';
import Logger from './logger';

const pgconfig = {
    connectionString: 'postgres://postgres:postgres@db-generic-postgres:5432/testdb',
    max: DB.max,
    connectionTimeoutMillis: DB.connectionTimeoutMillis,
    idleTimeoutMillis: DB.idleTimeoutMillis,
}

const pool = new pgk.Pool(pgconfig);

pool.on('error', function (err: Error) {
    Logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

Logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on('error', function (err: Error) {
    Logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

/* 
 * Single Query to Postgres
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlToDB = async (sql: string, data: string[][]) => {
    Logger.debug(`sqlToDB() sql: ${sql} | data: ${data}`);
    let result: pgk.QueryResult;
    try {
        result = await pool.query(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

/*
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMMIT or ROALLBACK needs to be called at the end before releasing the connection back to pool.
 */
export const getTransaction = async () => {
    Logger.debug(`getTransaction()`);
    const client: pgk.PoolClient = await pool.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        throw new Error(error.message);
    }
}

/* 
 * Execute a sql statment with a single row of data
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecSingleRow = async (client: pgk.PoolClient, sql: string, data: string[][]) => {
    Logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
    let result: pgk.QueryResult;
    try {
        result = await client.query(sql, data);
        Logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
        return result
    } catch (error) {
        Logger.error(`sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`);
        throw new Error(error.message);
    }
}

/*
 * Execute a sql statement with multiple rows of parameter data.
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecMultipleRows = async (client: pgk.PoolClient, sql: string, data: string[][]) => {
    Logger.debug(`inside sqlExecMultipleRows()`);
    Logger.debug(`sqlExecMultipleRows() data: ${data}`);
    if (data.length !== 0) {
        for (let item of data) {
            try {
                Logger.debug(`sqlExecMultipleRows() item: ${item}`);
                Logger.debug(`sqlExecMultipleRows() sql: ${sql}`);
                await client.query(sql, item);
            } catch (error) {
                Logger.error(`sqlExecMultipleRows() error: ${error}`);
                throw new Error(error.message);
            }
        }
    } else {
        Logger.error(`sqlExecMultipleRows(): No data available`);
        throw new Error('sqlExecMultipleRows(): No data available');
    }
}

/*
 * Rollback transaction
 */
export const rollback = async (client: pgk.PoolClient) => {
    if (typeof client !== 'undefined' && client) {
        try {
            Logger.info(`sql transaction rollback`);
            await client.query('ROLLBACK');
        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    } else {
        Logger.warn(`rollback() not excuted. client is not set`);
    }
}

/*
 * Commit transaction
 */
export const commit = async (client: pgk.PoolClient) => {
    Logger.debug(`sql transaction committed`);
    try {
        await client.query('COMMIT');
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

// export const insert = async (table: string, columns: string, params: any[]) => {
//     ;(async () => {
//         const client = await pool.connect();
//         try {
//             const res = await client.query('SELECT * FROM bulk_csv.insurance', [])
//             console.log(res.rows[0])
//         } finally {
//             client.release()
//         }
//     })().catch(err => console.log(err.stack));
// }
//
// export const select = async (table: string) => {
//     ;(async () => {
//         const client = await pool.connect();
//         try {
//             const res = await client.query(`select * from ${table}`, [])
//             Logger.debug('rows', res.rows[0])
//         } finally {
//             client.release()
//         }
//     })().catch(err => Logger.error('error', err.stack))
// }
