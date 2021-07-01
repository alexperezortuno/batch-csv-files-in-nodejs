import fs from 'fs';
import Logger from '../libs/logger';

export default class Utils {
    private static _instance: Utils;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public createDir = (dir: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                resolve(true);
            } catch (e) {
                Logger.error(e.toString());
                reject(false);
            }
        });
    }

    readDirectory = async (dirname: string): Promise<string[]> => {
        return await new Promise((resolve, reject) => {
            fs.readdir(dirname, (error, filenames) => {
                if (error) {
                    reject(error.message.toString());
                } else {
                    resolve(filenames);
                }
            });
        });
    }

    isFile = (param: string): boolean => {
        try {
            return fs.lstatSync(param).isFile();
        } catch (e) {
            Logger.error(e.toString());
            return false;
        }
    }

    isDirectory = (param: string): boolean => {
        try {
            return fs.lstatSync(param).isDirectory();
        } catch (e) {
            Logger.error(e.toString());
            return false;
        }
    }
}
