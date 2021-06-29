import Server from './classes/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import Logger from './lib/logger';
import healthRouter from './route/health.route';
import fileRouter from './route/file.route';

const server = Server.instance;
const context: string = `/${server.context}`;

// BodyParser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({origin: true, credentials: true}));

// Routes
server.app.use(context, healthRouter);
server.app.use([context, 'file'].join('/'), fileRouter);

server.init(() => {
    Logger.info(`⚡️ Server is running in port: ${server.port}`);
});
