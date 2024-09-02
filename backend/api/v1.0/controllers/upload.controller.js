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

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads', 'profile'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const uploadProfileImage = multer({
    storage: profileStorage,
    limits: { fileSize: 4 * 1000000, fields: 1, files: 1 },
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
}).single('profileImage');

export const singleImageUpload = async (req, res, next) => {
    const pageId = req.user._id.toString();
    const tmpfilesCount = await TmpFiles.countDocuments({ pageId: pageId });
    if (tmpfilesCount >= 6) {
        await TmpFiles.deleteOne({ pageId }).sort({ createdAt: -1 })
    }

    uploadSingleImage(req, res, async (err) => {
        // console.log(req.body);
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, msg: 'Filesize must be under 15 MB' })
        } else if (err) {
            return res.status(500).json({ success: false, msg: err })
        }

        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'No File Provided!' });
        }

        let fileAccesstoken = crypto.randomBytes(36).toString('hex');

        const fileData = {
            pageId: pageId,
            fileAccesstoken: fileAccesstoken,
            filename: req.file.filename,
            path: req.file.path,
            url: req.protocol + "://" + req.get("host") + "/tmpPostData/" + req.file.filename,
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

export const profilePicUpload = async (req, res, next) => {
    const pageId = req.user._id.toString();
    const tmpfilesCount = await TmpFiles.countDocuments({ pageId: pageId });
    if (tmpfilesCount >= 6) {
        await TmpFiles.deleteOne({ pageId }).sort({ createdAt: -1 })
    }
    uploadProfileImage(req, res, async (err) => {
        // console.log(req.body);
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, msg: 'Filesize must be under 15 MB' })
        } else if (err) {
            return res.status(500).json({ success: false, msg: err })
        }

        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'No File Provided!' });
        }

        // TODO: check maximum upload count by checking count of userId in fileData

        let fileAccesstoken = crypto.randomBytes(36).toString('hex');

        const fileData = {
            pageId: pageId,
            fileAccesstoken: fileAccesstoken,
            filename: req.file.filename,
            path: req.file.path,
            url: req.protocol + "://" + req.get("host") + "/profile/" + req.file.filename,
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