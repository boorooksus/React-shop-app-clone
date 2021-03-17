const express = require('express');
const router = express.Router();
const multer = require('multer');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    // 'uploads' 폴더에 이미지 저장
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // 저장 이미지 이름 설정
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single("file")


// '/api/product/image' 대신 '/image'만 쓰는 것 주의!
router.post('/image', (req, res) => {

    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})

module.exports = router;