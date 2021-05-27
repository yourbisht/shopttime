import e from 'express'
import expres from 'express'
import multer from 'multer'
import path from 'path'


const router = expres.Router()


const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, '../client/public/images/')
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})
function checkFileType(file, cb){
    const fileType = /jpg|jpeg|png/
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.mimetype)

    if(extname && mimetype){
        return cb(null, true)
    }else{
        cb('Images only!')
    }
}
const upload = multer({
    storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
})

router.post('/', upload.single('image'), (req, res) => {
    const paths = req.file.path.substring(16)
    res.send(`${paths}`)
})

export default router