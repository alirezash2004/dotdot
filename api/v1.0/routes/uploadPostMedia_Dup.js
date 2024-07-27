import express from 'express';
import path from 'path';
import multer from 'multer';
const upload = multer({
    dest: 'uploads/tmpPostData',
    limits: { fileSize: 15 * 1000000, fields: 1, files: 3 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images only! (jpeg, jpg, png)'));
        }
    }
}).single('postImage');
import crypto from 'crypto';
import { tmpFiles } from '../helpers/mockfilemanager.js';
const router = express.Router();

router.post('/postMedia/uploadPostMedia', (req, res, next) => {
    upload(req, res, (err) => {
        // console.log(req.file);
        // console.log(req.files);
        // console.log(req.body);
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, msg: 'Filesize must be under 15 MB' })
        } else if (err) {
            return res.status(500).json({ success: false, msg: err })
        }

        // {
        //     fieldname: 'postImage',
        //     originalname: 'quran_PNG67.png',
        //     encoding: '7bit',
        //     mimetype: 'image/png',
        //     destination: 'uploads/tmpPostData',
        //     filename: '3e2e213319f6ad8396acd2c1c5a678bc',
        //     path: 'uploads\\tmpPostData\\3e2e213319f6ad8396acd2c1c5a678bc',
        //     size: 57769
        //   }


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