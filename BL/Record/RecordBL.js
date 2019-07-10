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
                equipmentId: equipId.replace(/"/g,''),
                equipmentName: equipName,
                dateTime:nd
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
                callback(success)
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
   
    var promise = conn.RecordsByUsers.find({
        psid: psid,
        dateTime: nd,
        equipmentId: queryBody.eqid.replace(/"/g,'')
    })

    promise.then(
        (records) => {
            if(records.length>0){
                callback(records[0].recordsByPeriod)
            }
            callback([])
        },
        (err) => {
            fail(err)
        }
    )
}