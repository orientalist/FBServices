var mongoose=require('mongoose')

mongoose.connect(require('../config').ConnStr('Record'),{userNewUrlParser:true})

var Schema=mongoose.Schema

module.exports=mongoose.model('Records',new Schema({
    psid:{
        type:String,
        required:true
    },
    equipmentId:{
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
    }
}))