var bl=require('./functions/equipmentBL')
var conn=require('./Connection')

var p=bl.GetEquipments(conn,1,
    (err)=>{
        console.log(err)
    },
    (promise)=>{
        promise.then(
            (eqs)=>{
                console.log(eqs)
            },
            (err)=>{
                console.log(err)
            }
        )
    })