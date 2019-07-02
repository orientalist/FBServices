var connection=require('./models/db/Connection')

var recordBl=require('./models/db/functions/recordBL')

recordBl.QueryRecordByPsid('2208236499223584',connection,
(err)=>{
    console.log(err)
},
(promise)=>{
    promise.then(
        (records)=>{            
            console.log(records)
        },
        (err)=>{            
            console.log(err)
        }
    )
})