import cron from 'node-cron';
import Logger from '../libs/logger';
import * as path from 'path';
import Utils from './utils';
import {parseFile} from 'fast-csv';

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
            Logger.debug('csv scheduler task running');
            Logger.debug(__dirname);
            const dirname: string = `${__dirname}/outputs`;
            this.recursiveDirectory(dirname)
                .then((res: string[]) => {
                    if (res && res.length > 0) {
                        sch.stop();
                        const promises = [];

                        for (const r of res) {
                            promises.push(this.processCsv(r));
                            // this.processCsv(r).then(() => {});
                        }

                        return Promise.all(promises);
                        // sch.start();
                    }
                    console.timeEnd('csvScheduler');
                })
                .then(r => {
                    Logger.debug('complete ' + r);
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
                .catch(err => {
                    Logger.error('recursiveDirectory', err.toString());
                    reject(files);
                })
                .finally(() => {
                    resolve(files);
                });
        });
    }

    processCsv = (param: string): Promise<boolean> => {
        return new Promise(async resolve => {
            parseFile(param, {headers: true})
                .on('error', error => Logger.error(error.message))
                .on('data', row => {
                    // db.insert('insurance',
                    //     'statecode, policyID',
                    //     [row.statecode, row.policyID]);
                    Logger.debug('row', row.toString());
                })
                .on('end', (rowCount: number) => {
                    console.log(`Parsed ${rowCount} rows`);
                    resolve(true);
                });
        });
    }
}
