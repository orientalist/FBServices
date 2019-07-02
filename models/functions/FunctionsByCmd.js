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
                    var _buttons=[
                        buttons.Get.web_url('上胸', `${url}1`, 'tall'),
                        buttons.Get.web_url('中胸', `${url}2`, 'tall'),
                        buttons.Get.web_url('下胸', `${url}3`, 'tall')
                    ]                    
                    response=templates.Buttons.template('請選擇部位',_buttons)
                    break
            }
            break
    }
    return response
}