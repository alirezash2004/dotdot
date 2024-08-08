import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { __filename, __dirname } from '../../../currentPath.js';
import TmpFiles from '../models/tmpFiles.model.js';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads', 'tmpPostData'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

// TODO: add single video also
const uploadSingleImage = multer({
    storage: storage,
    limits: { fileSize: 15 * 1000000, fields: 1, files: 3 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only! (jpeg, jpg, png)', false);
        }
    },
}).single('postImage');

export const singleImageUpload = (req, res, next) => {
    const pageId = req.user._id.toString();
    uploadSingleImage(req, res, async (err) => {
        // console.log(req.body);
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, msg: 'Filesize must be under 15 MB' })
        } else if (err) {
            return res.status(500).json({ success: false, msg: err })
        }

        // TODO: check maximum upload count by checking count of userId in fileData

        let fileAccesstoken = crypto.randomBytes(36).toString('hex');

        const fileData = {
            pageId: pageId,
            fileAccesstoken: fileAccesstoken,
            filename: req.file.filename,
            path: req.file.path,
            fileExt: path.extname(req.file.originalname).toLowerCase().replace('.', ''),
            createdAt: Date.now(),
        }

        // console.log(req.file);

        const newTmpFile = new TmpFiles(fileData);

        await newTmpFile.save()
            .then((tmpfile) => {
                return res.status(200).json({ success: true, fileAccesstoken: fileAccesstoken });
            })
            .catch((reason) => {
                const error = new Error(reason);
                error.status = 404;
                return next(error);
            })
    })
}