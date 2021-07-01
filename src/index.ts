import Server from './classes/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import { cpus } from 'os';
import Logger from './libs/logger';
import healthRouter from './route/health.route';
import fileRouter from './route/file.route';
import Cron from './classes/cron';
import insuranceRouter from './route/insurance.route';
const numCPUs = cpus().length;

const server = Server.instance;
const schedulerTasks = Cron.instance;
const context: string = `/${server.context}`;

// BodyParser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({origin: true, credentials: true}));

// Scheduler Tasks
schedulerTasks.csvScheduler(server.csvScheduler).then(() => {});

// Routes
server.app.use(context, healthRouter);
server.app.use(context, insuranceRouter);
server.app.use([context, 'file'].join('/'), fileRouter);

server.init(() => {
    Logger.info(`⚡ Server is running in port: ${server.port}`);
});
