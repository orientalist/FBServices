var mongoose = require('mongoose')

mongoose.connect(require('../config').ConnStr('Category'), { useNewUrlParser: true })

var Schema = mongoose.Schema

module.exports = mongoose.model('Equipments',
    new Schema({
        belongTo: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        picUrl: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            enum: [0, 1, 2],
            default: 0
        }
    })
)