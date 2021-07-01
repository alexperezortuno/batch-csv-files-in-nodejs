import {Router, Request, Response} from 'express';
import Responses from '../classes/responses';
import {uploadOneCsv} from '../libs/files';
import Logger from '../libs/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
// @ts-ignore
import * as csvSplitStream from 'csv-split-stream';
import Utils from '../classes/utils';

const fileRouter: Router = Router();
const responses: Responses = Responses.instance;
const __dirname = path.resolve();
const utils = Utils.instance;

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

            const splitDirectory = `outputs/${req.file?.originalname.replace('.csv', '')}`;

            utils.createDir(splitDirectory)
                .then(response => {
                    if (response) {
                        csvSplitStream
                            .split(
                                fs.createReadStream(path.resolve(__dirname, <string>req.file?.destination, <string>req.file?.filename)),
                                {
                                    lineLimit: 1000
                                },
                                (index: any) => fs.createWriteStream(path.resolve(__dirname, splitDirectory, `output-${req.file?.originalname}-${index}.csv`))
                            )
                            .then((csvSplitResponse: any) => {
                                Logger.debug(`csvSplitStream succeeded ${csvSplitResponse.toString()}`);
                                utils.removeFile(path.resolve(__dirname, <string>req.file?.destination, <string>req.file?.filename));
                                responses.ok(req, res);
                            })
                            .catch((csvSplitError: any) => {
                                Logger.debug(`csvSplitStream failed! ${csvSplitError.toString()}`);
                                responses.internalServerError(req, res, {
                                    ok: false,
                                    message: csvSplitError.toString()
                                });
                            });
                    }
                });
        } catch (err) {
            Logger.error(err.toString());
            responses.internalServerError(req, res, {
                ok: false,
                message: err.toString()
            });
        }
    });
});

fileRouter.get('/csv-process', (req: Request, res: Response) => {
    fs.createReadStream(path.resolve(__dirname, 'uploads', 'file-1624975801385-374155778-salesjan2009.csv'))
        .pipe(csv.parse({headers: true}))
        .on('error', error => Logger.error(error.message))
        .on('data', row => Logger.debug(row))
        .on('end', (rowCount: number) => Logger.debug(`Parsed ${rowCount} rows`));
    responses.ok(req, res);
});

export default fileRouter;
