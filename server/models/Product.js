const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    // product 등록한 사람
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },

    continents: {
        type: Number,
        default: 1
    },

    views: {
        type: Number,
        default: 0
    }
    // timestamps: true면 자동으로 등록시간 업데이트
}, { timestamps: true })

// 검색어가 위 옵션 중 어디에 중점적으로 검색할지 설정. 몽고db 공홈 참조
productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        // title의 중요도 5, desc 중요도 1
        title: 5,
        description: 1
    }
})


const Product = mongoose.model('Product', productSchema);

module.exports = { Product }