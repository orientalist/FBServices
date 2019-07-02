exports.GetEquipments = (connection, partiotionSn, dataError, returnPromise) => {
    if (!connection || !partiotionSn || isNaN(partiotionSn)) {
        dataError('參數錯誤')
<<<<<<< HEAD
    } else {
        returnPromise(connection.Equipment.aggregate([
            {
                $match:{
                    groupSn:parseInt(partiotionSn)
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
=======
    }else{
        returnPromise(connection.Equipment.find({ belongTo: partiotionSn,status:1}))
>>>>>>> 5d9ff2cbce867e8c98aa9ba7dbad07e473e6f42d
    }
}