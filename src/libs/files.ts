import multer from 'multer';

const csvFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(CSV|csv)$/)) {
        return cb(new Error('Only csv files are allowed!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.CSV_DESTINATION || 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname.toLowerCase()}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}`)
    }
})

const csvLimits = {
    /** Maximum size of each form field name in bytes. (Default: 100) */
    fieldNameSize: Number(process.env.CSV_FIELD_NAME_SIZE) || 100,
    /** Maximum size of each form field value in bytes. (Default: 1048576) */
    fieldSize: Number(process.env.CSV_FIELD_SIZE) || 1048576,
    /** Maximum number of non-file form fields. (Default: Infinity) */
    fields: Number(process.env.CSV_FIELDS) || 50,
    /** Maximum size of each file in bytes. (Default: Infinity) */
    fileSize: Number(process.env.CSV_FIELD_SIZE) || 100000000,
    /** Maximum number of file fields. (Default: Infinity) */
    files: Number(process.env.CSV_FILES) || 100000000,
    /** Maximum number of parts (non-file fields + files). (Default: Infinity) */
    parts: Number(process.env.CSV_PARTS) || 100000000,
    /** Maximum number of headers. (Default: 2000) */
    headerPairs: Number(process.env.CSV_HEADER_PAIRS) || 2000,
}

export const uploadArrCsv = multer({
    fileFilter: csvFilter,
    limits: csvLimits,
}).array('file');

export const uploadOneCsv = multer({
    storage,
    fileFilter: csvFilter,
    dest: process.env.CSV_DESTINATION || 'uploads',
    limits: csvLimits,
}).single('file');

