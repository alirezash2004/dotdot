import Router from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { tmpFiles } from '../helpers/mockfilemanager.js';
import { __filename, __dirname } from '../../../currentPath.js';
const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads', 'tmpPostData'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
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

router.post('/postMedia/uploadPostMedia/singleImage', (req, res, next) => {
    uploadSingleImage(req, res, (err) => {
        // console.log(req.body);
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, msg: 'Filesize must be under 15 MB' })
        } else if (err) {
            return res.status(500).json({ success: false, msg: err })
        }

        // TODO: check maximum upload count by checking count of userId in fileData

        let fileAccesstoken = crypto.randomBytes(36).toString('hex');

        const fileData = {
            userId: 1, // TODO: get real userid
            fileAccesstoken: fileAccesstoken,
            filename: req.file.filename,
            path: req.file.path,
            fileExt: path.extname(req.file.originalname).toLowerCase().replace('.', ''),
            createdTimestamp: Date.now(),
        }

        tmpFiles.push(fileData);

        res.status(200).json({ success: true, fileAccesstoken: fileAccesstoken });
    })
});




export default router;