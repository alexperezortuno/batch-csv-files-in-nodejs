import {PoolClient, QueryResult} from 'pg';
import * as dbUtil from './../libs/database';
import Logger from '../libs/logger';

const transactionSuccess: string = 'transaction success';

/*
 * sample query
 * @return server time
 */
export const findAll = async () => {
    let sql = "SELECT * FROM bulk_csv.insurance;";
    let data: string[][] = [];
    let result: QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}
