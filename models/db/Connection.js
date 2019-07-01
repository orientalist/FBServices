var mongoose = require('mongoose')

mongoose.connect(require('./config').ConnStr('Category'), { userNewUrlParser: true })

var Schema = mongoose.Schema

exports.Equipment = mongoose.model('Equipments',
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

exports.Record = mongoose.model('Records',
    new Schema({
        psid: {
            type: String,
            required: true
        },
        equipmentId: {
            type: String,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        times: {
            type: Number,
            required: true
        }
    })
)