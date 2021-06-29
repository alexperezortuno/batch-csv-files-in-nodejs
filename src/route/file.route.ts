import {Router, Request, Response} from 'express';
import Responses from '../classes/responses';
import {uploadOneCsv} from '../lib/image';
import Logger from '../lib/logger';

const fileRouter: Router = Router();
const responses: Responses = Responses.instance;

fileRouter.post('/upload', (req: Request, res: Response) => {
    uploadOneCsv(req, res, async err => {
        try {
            if (err) {
                responses.internalServerError(req, res);
            }

            const file = req.file;

            if (!file) {
                Logger.error('file not uploaded')
                responses.badRequest(req, res, {
                    ok: false,
                    message: 'file is required'
                });
            }

            responses.ok(req, res);
        } catch (err) {
            Logger.error(err.toString());
        }
    });
});

export default fileRouter;
