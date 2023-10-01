const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/upload');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
        const fileName = uniqueSuffix + fileExtension;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
