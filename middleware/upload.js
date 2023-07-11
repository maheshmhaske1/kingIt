const multer = require('multer')

exports.upload_profile = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/profile_images/`)
        },
        filename: function (req, file, cb) {
            cb(null, `profile_image_` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).single('profile_image')

exports.upload_post = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/posts/`)
        },
        filename: function (req, file, cb) {
            cb(null, `post` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).single('post')


exports.upload_store = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/store/`)
        },
        filename: function (req, file, cb) {
            cb(null, `store` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).single('store')


exports.upload_banner = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/banner/`)
        },
        filename: function (req, file, cb) {
            cb(null, `banner` + `${Date.now()}` + `_` + file.originalname)
        }
    }),
}).single('store')



