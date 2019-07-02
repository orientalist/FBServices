exports.GetEquipments = (connection, partiotionSn, dataError, returnPromise) => {
    if (!connection || !partiotionSn || isNaN(partiotionSn)) {
        dataError('參數錯誤')
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
    }
}