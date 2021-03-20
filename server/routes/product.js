const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require("../models/Product");

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

// 상품 업로드 페이지에서 보낸 정보를 받아서 db에 저장
router.post('/', (req, res) => {

    //받아온 정보들을 DB에 넣어 준다.
    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

})

router.post('/products', (req, res) =>{

    // product collection에 들어 있는 모든 상품 정보를 가져오기 
    // limit 존재한다면 req.body.limit으로, 없다면 20으로
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            // 필터에 적용할 값이 있는 경우

            console.log('key: ', key)

            if (key === "price") {
                findArgs[key] = {
                    // gte: Greater than equal. mongodb method
                    $gte: req.body.filters[key][0],
                    // lte: Less than equal
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }

        }
    }

    Product.find(findArgs)
        .populate("writer")
        .skip(skip)  // 상품 정보 인덱스 몇 부터 가져올지
        .limit(limit)  // 상품 몇 개 가져올지
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, productInfo,
                postSize: productInfo.length
            })
        })
})

module.exports = router;