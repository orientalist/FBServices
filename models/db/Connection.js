var mongoose = require('mongoose')

mongoose.connect(require('./config').ConnStr('Record'), { useNewUrlParser: true })

var Schema = mongoose.Schema

exports.Equipments = mongoose.model('Equipments',
    new Schema({
        belongTo: {
            type: String,
            required: true
        },
        groupSn: {
            type: Number,
            required: true
        },
        groupName: {
            type: String,
            required: true
        },
        groupStatus: {
            type: Number,
            required: true
        },
        equipments: [
            {
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
                    required: true
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
        dateTime: {
            type: Date,
            default: () => {
                var d = new Date()
                var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                var nd = new Date(utc + (3600000 * 8))
                nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())
                return nd
            }
        },
        records: [
            {
                equipmentId: {
                    type: String,
                    required: true
                },
                equipmentName: {
                    type: String,
                    require: true
                },
                weight: {
                    type: Number,
                    required: true
                },
                times: {
                    type: Number,
                    required: true
                },
                recordTime: {
                    type: Date,
                    default: () => {
                        var d = new Date()
                        var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                        var nd = new Date(utc + (3600000 * 8))
                        return nd
                    }
                }
            }
        ]
    })
)

exports.SubPartitions = mongoose.model('Subpartitions',
    new Schema({
        subPartitions: [
            {
                belongTo: {
                    type: String,
                    required: true
                },
                groupSn: {
                    type: Number,
                    required: true
                },
                groupName: {
                    type: String,
                    required: true
                },
                groupStatus: {
                    type: Number,
                    required: true
                }
            }
        ]
    })
)

exports.RecordsByUsers = mongoose.model('RecordsByUsers',
    new Schema({
        dateTime: {
            type: Date,
            required: true,
            default: () => {
                var d = new Date()
                var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                var nd = new Date(utc + (3600000 * 8))
                nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())
                return nd
            }
        },
        psid: {
            type: String,
            required: true
        },
        equipmentId: {
            type: String,
            required: true
        },
        equipmentName: {
            type: String,
            required: true
        },
        recordsByPeriod: [
            {
                weight: {
                    type: Number,
                    required: true
                },
                times: {
                    type: Number,
                    required: true
                },
                period: {
                    type: Date,
                    required: true,
                    default: () => {
                        var d = new Date()
                        var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                        var nd = new Date(utc + (3600000 * 8))
                        return nd
                    }
                }
            }
        ]
    })
)

exports.BestRecords = mongoose.model('BestRecords',
    new Schema({
        psid:{
            type:String,
            required:true
        },
        records:[
            {
                equipmentId:{
                    type:String,
                    required:true
                },
                equipmentName:{
                    type:String,
                    required:true
                },
                weight:{
                    type:Number,
                    required:true
                },
                times:{
                    type:Number,
                    required:true
                },
                dateTime:{
                    type:Date,
                    required:true
                }
            }
        ]
    })
)