const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const appError = require("../errors/appError.js");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../..", "uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        cb(null, uuid.v4() + ext);
    }
});


const uploadProfile = multer({
    storage,
    limits: {
        fileSize: (1 * 1024 /* Converteu para 1Kb */ * 1024) /* Converteu para 1MB */ * 5 /* 5MB */
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            return cb(null, true);
        }

        return cb(appError("Invalid file type. Supported types: image/png, image/jpg", 400));
    }
});


const uploadProfileMiddleware = (req, res, next) => {
    const upload = uploadProfile.single("profilePhoto");

    upload(req, res, (error) => {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            next(appError("File size limit exceeded. Maximum allowed size is 5MB.", 400));
        }

        return next();
    });
};




const storagePost = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../..", "temp_uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        cb(null, uuid.v4() + ext);
    }
});


const uploadPost = multer({
    storagePost,
    limits: {
        fileSize: (1 * 1024 /* Converteu para 1Kb */ * 1024) /* Converteu para 1MB */ * 100 /* 100MB */
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "video/mp4" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            return cb(null, true);
        }

        return cb(appError("Invalid file type. Supported types: image/png, image/jpg, video/mp4", 400));
    }
});

const uploadPostMiddleware = (req, res, next) => {
    const upload = uploadPost.single("postFile");

    upload(req, res, (error) => {
        if (error) {
            if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
                next(appError("File size limit exceeded. Maximum allowed size is 100MB.", 400));
            }

            return next(error);
        }
    });

    if (req.file) {
        const filePath = path.join(__dirname, "../../temp_uploads/" + req.file.filename);
        const output = path.join(__dirname, "../..", "uploads");

        const start = req.start;
        const duration = req.duration;

        ffmpeg(filePath)
            .setStartTime(`${start}`)
            .setDuration(`${duration}`)
            .output(`${output}/${req.file.filename}`)
            .on("end", (error) => {
                if (error) {
                    next(appError("Trimming video error", 500));
                }
            })
            .run()
    }

};

module.exports = {
    uploadProfileMiddleware
};