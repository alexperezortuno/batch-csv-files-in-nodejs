import express from 'express';
import {SERVER, DB, SCHEDULER} from '../global/environment';
import http from 'http';

export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public context: string;
    public csvScheduler: string;
    private readonly _http: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER.port;
        this._http = new http.Server(this.app);
        this.context = SERVER.context;
        this.csvScheduler = SCHEDULER.csvScheduler;
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    init(callback: any) {
        this._http.listen(this.port, callback);
    }
}
