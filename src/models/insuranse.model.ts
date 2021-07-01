import {PoolClient, QueryResult} from 'pg';
import * as dbUtil from './../libs/database';
import Logger from '../libs/logger';

const transactionSuccess: string = 'transaction success';
const table = 'bulk_csv.insurance';

/*
 * sample query
 * @return server time
 */
export const findAll = async () => {
    let sql = `SELECT * FROM ${table};`;
    let data: string[][] = [];
    let result: QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const insert = async (data: string[][]): Promise<string> => {
    // let singleSql = "DELETE FROM TEST";
    let singleSql = `INSERT INTO ${table} (statecode, policy_id) VALUES ($1, $2);`;
    // let multiSql = `INSERT INTO ${table} () VALUES ($1, $2);`;
    // let singleData: string[][] = [];
    // let multiData: string[][] = [['typescript'], ['is'], ['fun']];
    let client: PoolClient = await dbUtil.getTransaction();
    try {
        await dbUtil.sqlExecSingleRow(client, singleSql, data);
        // await dbUtil.sqlExecMultipleRows(client, multiSql, multiData);
        await dbUtil.commit(client);
        return transactionSuccess;
    } catch (error) {
        await dbUtil.rollback(client);
        Logger.error(`sampleTransactionModel error: ${error.message}`);
        throw new Error(error.message);
    }
}

export const batch = async (data: any[][]): Promise<string> => {
    let multiSql = `INSERT INTO ${table} (statecode, policy_id) VALUES ($1, $2);`;
    let client: PoolClient = await dbUtil.getTransaction();
    try {
        await dbUtil.sqlExecMultipleRows(client, multiSql, data);
        await dbUtil.commit(client);
        return transactionSuccess;
    } catch (error) {
        await dbUtil.rollback(client);
        Logger.error(`sampleTransactionModel error: ${error.message}`);
        throw new Error(error.message);
    }
}
