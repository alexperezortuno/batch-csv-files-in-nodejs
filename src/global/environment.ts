import {ServerInterface} from '../interface/server.interface';

export const SERVER: ServerInterface = {
    port: Number(process.env.PORT) || 5000,
    logLevel: process.env.LOG_LEVEL || 'debug',
    env: process.env.SERVER_ENV || 'development',
    context: process.env.CONTEXT || 'api',
}
