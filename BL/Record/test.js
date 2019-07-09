var conn = require('../../models/db/Connection')
var recordBl = require('./RecordBL')

recordBl.GetEquipments(conn, 2,
    (result) => {
        console.log('success')        
        console.log(result.length)
    },
    (err) => {
        console.log('err')
        console.log(err)
    }    
)