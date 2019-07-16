var offifialApi = require('../../models/functions/OfficialAPIs')
var encryptCenter = require('../../models/Encryption/EncryptionCenter')
var equipmentBL = require('../../models/db/functions/equipmentBL')

exports.GetUserProfile = (pid, postback, fail) => {
    var promise = offifialApi.GetUserProfile_Promise(encryptCenter.Decrypt_AES192(pid))
    promise.then(
        (_profile) => {
            postback(_profile)
        },
        (err) => {
            fail(err)
        }
    )
}

exports.GetEquipments = (connection, partitionId, callback, fail) => {
    var errorMsg
    equipmentBL.GetEquipments(connection, partitionId,
        (invalidateMsg) => {
            errorMsg = invalidateMsg
            fail(errorMsg)
        },
        (_promise) => {
            _promise.then(
                (_equipments) => {
                    callback(_equipments)
                },
                (err) => {
                    errorMsg = err
                    fail(errorMsg)
                }
            )
        })
}

exports.SaveRecord = (psid, equipId, equipName, weight, times, connection, fail, callback) => {
    var errMsg = ''
    if (!psid) {
        errMsg = '用戶編號遺失'
    }
    if (!equipId) {
        errMsg = '器材編號遺失'
    }
    if (!equipName) {
        errMsg = '器材名稱遺失'
    }
    if (!weight) {
        errMsg = '重量遺失'
    }
    if (!times) {
        errMsg = '次數遺失'
    }
    if (connection == null) {
        errMsg = '連線中斷'
    }

    if (errMsg.length > 0) {
        fail(errMsg)
    } else {
        psid = encryptCenter.Decrypt_AES192(psid)

        var d = new Date()
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
        var nd = new Date(utc + (3600000 * 8))
        nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())

        var promise = connection.RecordsByUsers.update(
            {
                psid: psid,
                equipmentId: equipId.replace(/"/g, ''),
                equipmentName: equipName,
                dateTime: nd
            },
            {
                $push: {
                    recordsByPeriod: {
                        weight: weight,
                        times: times
                    }
                }
            },
            { upsert: true }
        )

        promise.then(
            (success) => {
                connection.BestRecords.find(
                    {
                        psid: psid,
                        'records.equipmentId': equipId.replace(/"/g, '')
                    },
                    {
                        _id: 0,
                        'records.$': 1
                    }
                ).then(
                    (record) => {
                        if (record.length > 0) {
                            var _weight = record[0].records[0].weight
                            if (weight > _weight) {
                                connection.BestRecords.update(
                                    {
                                        psid: psid,
                                        'records.equipmentId': equipId.replace(/"/g, '')
                                    },
                                    {
                                        $set: {
                                            'records.$.weight': weight,
                                            'records.$.times': times,
                                            'records.$.dateTime': nd,
                                        }
                                    }
                                ).then(
                                    (success) => {
                                        callback('new record')
                                    },
                                    (err) => {
                                        fail(err)
                                    }
                                )
                            }
                            else {
                                callback('not big enough')
                            }
                        } else {
                            connection.BestRecords.update(
                                {
                                    psid: psid
                                },
                                {
                                    $push: {
                                        records: {
                                            equipmentId: equipId.replace(/"/g, ''),
                                            equipmentName: equipName,
                                            weight: weight,
                                            times: times,
                                            dateTime: nd
                                        }
                                    }
                                }
                            ).then(
                                (success) => {
                                    callback('first of eq')
                                },
                                (err) => {
                                    fail(err)
                                }
                            )
                        }
                    },
                    (err) => {
                        fail(err)
                    }
                )
            },
            (err) => {
                fail(err)
            }
        )
    }
}

exports.GetRecordOfEquipment = (conn, queryBody, callback, fail) => {
    var psid = encryptCenter.Decrypt_AES192(queryBody.psid)

    var d = new Date()
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
    var nd = new Date(utc + (3600000 * 8))
    nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())
    //nd=new Date('2019-07-15T00:00:00.000+00:00')

    console.log(nd)
    var promise = conn.RecordsByUsers.find({
        psid: psid,
        dateTime: nd,
        equipmentId: queryBody.eqid.replace(/"/g, '')
    })

    promise.then(
        (records) => {
            if (records.length > 0) {
                callback(records[0].recordsByPeriod)
            }
            callback([])
        },
        (err) => {
            fail(err)
        }
    )
}

exports.GetRecordOfEquipment = (conn, eqid, psid, callback, fail) => {
    var psid = encryptCenter.Decrypt_AES192(psid)

    var d = new Date()
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
    var nd = new Date(utc + (3600000 * 8))
    nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())
    //nd = new Date('2019-07-16T00:00:00.000+00:00')

    var promise = conn.RecordsByUsers.find({
        psid: psid,
        dateTime: nd,
        equipmentId: eqid.replace(/"/g, '')
    }).select({ recordsByPeriod: 1, _id: 0 }).lean()

    promise.then(
        (records) => {
            if (records.length > 0) {
                callback(records[0].recordsByPeriod)
            } else {
                callback([])
            }
        },
        (err) => {
            fail(err)
        }
    )
}

exports.GetBestRecordOfEquipment = (conn, eqid, psid, callback, fail) => {
    var psid = encryptCenter.Decrypt_AES192(psid)
    var promise = conn.BestRecords.find(
        {
            psid:psid,
            'records.equipmentId':eqid.replace(/"/g, '')
        },
        {
            _id:0,
            'records.$':1
        }
    )

    promise.then(
        (record)=>{
            callback(record)
        },
        (err)=>{
            fail(err)
        }
    )
}

exports.InitializeBestRecords = (conn, psid, callback, fail) => {
    var promise = new conn.BestRecords({
        psid: psid
    }).save()

    promise.then(
        (success) => {
            callback(success)
        },
        (err) => {
            fail(er)
        }
    )
}

exports.DeleteBestRecord=(connection, psid, equipmentId,callback,fail)=>{
    var _equipmentId=equipmentId.replace(/"/g,'')
    var _psid=encryptCenter.Decrypt_AES192(psid)

    var promise=connection.BestRecords.update(
        {
            psid:_psid
        },
        {
            $pull:{
                records:{
                    equipmentId:_equipmentId
                }
            }
        }
    )

    promise.then(
        (succe)=>{
            callback(succe)
        },
        (err)=>{
            fail(er)
        }
    )
}

exports.DeleteRecord = (connection, psid, id, equipmentId, callback, fail) => {
    var _equipmentId = equipmentId.replace(/"/g, '')
    var _psid = encryptCenter.Decrypt_AES192(psid)

    var d = new Date()
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
    var nd = new Date(utc + (3600000 * 8))
    nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())
    //nd = new Date('2019-07-16T00:00:00.000+00:00')
    var promise = connection.RecordsByUsers.update(
        {
            psid:_psid,
            equipmentId:_equipmentId,
            dateTime:nd
        },
        {
            $pull:{
                recordsByPeriod:{
                    _id:id
                }
            }
        }
    )

    promise.then(
        (succ)=>{
            callback(succ)
        },
        (err)=>{
            fail(err)
        }
    )
}