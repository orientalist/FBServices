var templates = require('../../models/MessageModels/Template')
var buttons=require('../../models/MessageModels/Buttons')
var encCenter=require('../Encryption/EncryptionCenter')

exports.Record = (request, sender_psid) => {
    var response=null
    var url = `https://fbwebhook-240909.appspot.com/record?pid=${encCenter.Encrypt_AES192(sender_psid)}`
    switch (request.type) {
        case 'workout':
            url +='&type=workout'
            switch (request.partition) {
                case 'chest':
                    url += '&partition=chest&subPartition='
                    var _elements = [
                        templates.List.element('上胸', '', '',
                            null, [buttons.Get.web_url('上胸紀錄', `${url}1`, 'tall')]),
                        templates.List.element('中胸', '', '',
                            null, [buttons.Get.web_url('中胸紀錄', `${url}2`, 'tall')]),
                        templates.List.element('下胸', '', '',
                            null, [buttons.Get.web_url('下胸紀錄', `${url}3`, 'tall')])
                    ]
                    response=templates.List.template('compact',_elements)
                    break
            }
            break
    }
    return response
}