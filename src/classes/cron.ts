import cron from 'node-cron';
import Logger from '../libs/logger';
import * as path from 'path';
import Utils from './utils';
import {parseFile} from 'fast-csv';
import * as insurance from './../models/insuranse.model';

const __dirname: string = path.resolve();
const utils: Utils = Utils.instance;

export default class Cron {
    private static _instance: Cron;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    csvScheduler = async (param: string): Promise<void> => {
        const sch = cron.schedule(param, async () => {
            console.time('csvScheduler');
            Logger.info('⚙ csv scheduler task running');
            Logger.debug(__dirname);
            const dirname: string = `${__dirname}/outputs`;
            this.recursiveDirectory(dirname)
                .then((res: string[]) => {
                    if (res && res.length > 0) {
                        sch.stop();
                        const promises = [];

                        for (const r of res) {
                            promises.push(this.processCsv(r));
                        }

                        return Promise.all(promises);
                    }
                })
                .then(r => {
                    if (r !== undefined) {
                        for (const v of r) {
                            if (v.status) {
                                utils.removeFile(v.path);
                                Logger.debug('✔ complete ' + v.path);
                            } else {
                                Logger.debug('✖ not complete ' + v.path)
                            }
                        }
                    }
                })
                .finally(() => {
                    console.timeEnd('csvScheduler');
                    Logger.info('⚙ csv scheduler task end');
                    sch.start();
                });
        });
    }

    recursiveDirectory = async (param: string): Promise<string[]> => {
        let files: string[] = [];

        return new Promise(async (resolve, reject) => {
            await utils.readDirectory(param)
                .then(async (res: string[]) => {
                    for (let v of res) {
                        if (utils.isDirectory(`${param}/${v}`)) {
                            await utils.readDirectory(`${param}/${v}/`)
                                .then(r => {
                                    for (const y of r) {
                                        files.push(`${param}/${v}/${y}`);
                                    }
                                });
                        }
                    }
                })
                .finally(() => {
                    resolve(files);
                });
        });
    }

    processCsv = (param: string): Promise<{ path: any, status: boolean }> => {
        return new Promise(async resolve => {
            const bulk_data: any[][] = [];
            parseFile(param, {headers: true})
                .on('error', error => Logger.error(error.message))
                .on('data', async row => {
                    bulk_data.push([row.statecode, row.policyID]);
                })
                .on('end', async (rowCount: number) => {
                    Logger.debug(`Parsed ${rowCount} rows`);
                    await insurance.batch(bulk_data);
                    resolve({path: param, status: true});
                });
        });
    }
}
