import {Request, Response} from 'express';
import {HttpSuccess, HttpError} from '../global/http_codes';
import {ResponseInterface} from '../interface/response.interface';
import Logger from '../libs/logger';

export default class Responses {
    private static _instance: Responses;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    /**
     * Response ok
     *
     * @param req Request
     * @param res Response
     * @param data ResponseInterface (optional)
     */
    public ok(req: Request, res: Response, data?: ResponseInterface) {
        Logger.info(`method success from req: ${JSON.stringify(req.headers)}`);
        data = data || {
            ok: true,
            message: 'successfully'
        };

        res.status(HttpSuccess.ok)
            .json(data);
    }

    /**
     * Response method not allowed
     *
     * @param req Request
     * @param res Response
     * @param data ResponseInterface (optional)
     */
    public methodNotAllowed(req: Request, res: Response, data?: ResponseInterface) {
        Logger.error(`response not allowed from req: ${JSON.stringify(req.headers)}`);
        data = data || {
            ok: false,
            message: 'method not allowed'
        };

        res.status(HttpError.methodNotAllowed)
            .json(data);
    }

    /**
     * Response bad request
     *
     * @param req Request
     * @param res Response
     * @param data ResponseInterface (optional)
     */
    public badRequest(req: Request, res: Response, data?: ResponseInterface) {
        Logger.error(`response bat request from req: ${JSON.stringify(req.headers)}`);
        data = data || {
            ok: false,
            message: 'bad request'
        };
        res.status(HttpError.badRequest)
            .json(data);
    }

    /**
     * Response not found
     *
     * @param req Request
     * @param res Response
     * @param data ResponseInterface (optional)
     */
    public notFound(req: Request, res: Response, data?: ResponseInterface) {
        Logger.error(`response not found from req: ${JSON.stringify(req.headers)}`);
        data = data || {
            ok: false,
            message: 'not found'
        };
        res.status(HttpError.notFound)
            .json(data);
    }

    /**
     * Response unauthorized
     *
     * @param req Request
     * @param res Response
     * @param data ResponseInterface (optional)
     */
    public unauthorized(req: Request, res: Response, data?: ResponseInterface) {
        Logger.error(`response unauthorized from req: ${JSON.stringify(req.headers)}`);
        data = data || {
            ok: false,
            message: 'unauthorized'
        };
        res.status(HttpError.unauthorized)
            .json(data);
    }

    /**
     * Response internal server error
     *
     * @param req Request
     * @param res Response
     * @param data ResponseInterface (optional)
     */
    public internalServerError(req: Request, res: Response, data?: ResponseInterface) {
        Logger.error(`response not allowed from req: ${JSON.stringify(req.headers)}`);
        data = data || {
            ok: false,
            message: 'internal server error'
        };

        res.status(HttpError.internalServerError)
            .json(data);
    }
}
