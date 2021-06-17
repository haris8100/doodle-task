module.exports = app => {
    const product = require("../controllers/product.controller.js");
    const VerifyToken = require("../middleware/VerifyToken.js");
    var router = require("express").Router();
    var path = "/var/www/html/node/task/uploads/"

    const multer = require('multer');
    global.__basedir = __dirname;
    // -> Multer Upload Storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path)
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
        }
    });
    const upload = multer({ storage: storage });

    router.post("/import", [upload.single("uploadfile"),VerifyToken], product.import);

    router.get("/list", VerifyToken, product.list);

    app.use('/api/product/', router);
};