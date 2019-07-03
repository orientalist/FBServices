exports.GetEquipments = (connection, partiotionSn, dataError, returnPromise) => {
    if (!connection || !partiotionSn || isNaN(partiotionSn)) {
        dataError('參數錯誤')
    } else {
        returnPromise(connection.Equipment.aggregate([
            {
                $match:{
                    groupSn:parseInt(partiotionSn),
                    groupStatus:1
                }
            },{
                $unwind:'$equipments'
            },
            {
                $match:{
                    'equipments.status':1
                }
            }
        ]))
    }
}

exports.GetSubPartitions=(connection,catetogy,postback,fail)=>{
    if(!catetogy||!connection){
        fail('參數錯誤')
    }else{
        var promise=connection.Equipment.find({
            belongTo:catetogy,
            groupStatus:1            
        }).select({"groupSn":1,"groupName":1})
        promise.then(
            (subs)=>{
                postback(subs)
            },
            (err)=>{
                fail(err)
            }
        )
    }
}