import {Router, Request, Response} from 'express';
import Responses from '../classes/responses';

const healthRouter: Router = Router();
const responses: Responses = Responses.instance;

healthRouter.get('/health', (req: Request, res: Response) => {
    responses.ok(req, res, {
        ok: true,
        message: 'works fine',
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
