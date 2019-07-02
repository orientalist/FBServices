var mongoose = require('mongoose')

mongoose.connect(require('./config').ConnStr('Record'), { userNewUrlParser: true })

var Schema = mongoose.Schema

exports.Equipment = mongoose.model('Equipments',
    new Schema({
        groupSn:Number,
        equipments:[
            {
                name:{
                    type:String,
                    required:true
                },
                picUrl:{
                    type:String,
                    required:true
                },
                status:{
                    type:Number,
                    enum:[0,1,2],
                    default:1
                }
            }
        ]
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
        },
        date:{
            type:Date,
            default:()=>{
                var d=new Date()
                var utc=d.getTime()+(d.getTimezoneOffset()*60000)
                var nd=new Date(utc+(3600000*8))
                return nd
            }
        }
    })
)