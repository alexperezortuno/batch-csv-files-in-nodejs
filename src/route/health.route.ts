import {Router, Request, Response} from 'express';
import Responses from '../classes/responses';
import { QueryResult } from 'pg';
import * as sampleModel from './../models/model-sample';

const healthRouter: Router = Router();
const responses: Responses = Responses.instance;

healthRouter.get('/health', async (req: Request, res: Response) => {
    let result: QueryResult = await sampleModel.getTimeModel();
    responses.ok(req, res, {
        ok: true,
        message: `works fine: ${result.rows[0].now}`,
    });
});

healthRouter.post('/health', (req: Request, res: Response) => {
    responses.methodNotAllowed(req, res);
});

healthRouter.put('/health', (req: Request, res: Response) => {
    responses.methodNotAllowed(req, res);
});

healthRouter.delete('/health', (req: Request, res: Response) => {
    responses.methodNotAllowed(req, res);
});

export default healthRouter;
