import {Request, Response, Router} from 'express';
import Responses from '../classes/responses';
import {QueryResult} from 'pg';
import * as insuranse from '../models/insuranse.model';

const insuranceRouter: Router = Router();
const responses: Responses = Responses.instance;

insuranceRouter.get('/insurance', async (req: Request, res: Response) => {
    let result: QueryResult = await insuranse.findAll();
    responses.ok(req, res, {
        ok: true,
        data: result.rows,
    })
});
export default insuranceRouter;
