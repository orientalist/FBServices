var mongoose=require('mongoose')

mongoose.connect(require('../config').ConnStr(),{ useNewUrlParser: true })

var Schema=mongoose.Schema

var testSchema=new Schema({
    payload:{
        type:String,
        require:true
    }
})

var remoteTest=mongoose.model('cols',testSchema)

var test=new remoteTest({payload:'Hello world'})

test.save().then(()=>console.log('remote connection success.'))