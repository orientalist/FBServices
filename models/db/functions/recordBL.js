var encCneter = require('../../Encryption/EncryptionCenter')

exports.SaveRecord = (psid, equipId, weight, times, connection, dataError, returnPromise) => {
    var validateMsg = ''
    try {        
        if (!psid) {
            validateMsg = '遺失用戶編號'
        }
        if (!equipId) {
            validateMsg = '遺失器材編號'
        }
        if (!weight || isNaN(weight)) {
            validateMsg = '未輸入重量'
        }
        if (!times || isNaN(times)) {
            validateMsg = '未輸入次數'
        }

        if (validateMsg.length > 0) {
            dataError(validateMsg)
        } else {
            returnPromise(new connection.Record({ psid: encCneter.Decrypt_AES192(psid), equipmentId: equipId, weight: weight, times: times }).save())
        }
    } catch (e) {
        dataError(e)
    }
}

exports.QueryRecordByPsid = (psid, connection, dataError, retirnPromise) => {
    var validateMsg = ''
    if (!psid) {
        validateMsg = '遺失用戶編號'
    }
    if (validateMsg.length > 0) {
        dataError(validateMsg)
    } else {
        retirnPromise(connection.Record.find({ psid: psid }))
    }
}