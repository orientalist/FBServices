exports.GetEquipments = (connection, partiotionSn, dataError, returnPromise) => {
    if (!connection || !partiotionSn || isNaN(partiotionSn)) {
        dataError('參數錯誤')
    } else {
        returnPromise(connection.Equipments.aggregate([
            { $match: { groupSn: parseInt(partiotionSn) } },
            {
                $project: {
                    equipments: {
                        $filter: {
                            input: '$equipments',
                            as: 'equipments',
                            cond: { $eq: ['$$equipments.status', 1] }
                        }
                    }
                }
            }
        ]))
    }
}

exports.GetSubPartitions = (conn, subPartitionName, callback, fail) => {
    var promise = conn.SubPartitions.aggregate([
        {
            $unwind: '$subPartitions'

        }, {
            $match: {
                'subPartitions.belongTo': subPartitionName,
                'subPartitions.groupStatus': 1
            }
        }
    ])
    promise.then(
        (subPartitions) => {
            callback(subPartitions)
        },
        (err) => {
            fail(err)
        }
    )
}