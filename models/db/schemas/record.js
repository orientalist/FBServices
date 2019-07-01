var mongoose=require('mongoose')

mongoose.connect(require('../config').ConnStr(),{ useNewUrlParser: true })

var Schema=mongoose.Schema

exports.Workout=()=>{
    var schema=new Schema({
        belongTo:{
            type:Number,
            required
        },
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        picUrl:{
            type:String,
            required
        },
        status:{
            type:Number,
            enum:[0,1,2],
            default:0
        }
    })

    return mongoose.model('Record',schema)
}