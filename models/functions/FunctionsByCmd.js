var templates = require('../../models/MessageModels/Template')
var buttons=require('../../models/MessageModels/Buttons')
var encCenter=require('../Encryption/EncryptionCenter')
var equipBl=require('../db/functions/equipmentBL')

exports.Record = (request, sender_psid,conn,callback,fail) => {
    var response=null
    var url = `https://fbwebhook-240909.appspot.com/record?pid=${encCenter.Encrypt_AES192(sender_psid)}`
    switch (request.type) {
        case 'workout':
            url +='&type=workout'
            switch (request.partition) {
                case 'chest':
                    url += '&partition=chest&subPartition='
                    var _buttons=[]                    
                    equipBl.GetSubPartitions(conn,'chest',
                    (positions)=>{
                        positions.forEach(element => {
                            _buttons.push(buttons.Get.web_url(element.subPartitions.groupName,`${url}${element.subPartitions.groupSn}`,'tall'))
                        });
                        response=templates.Buttons.template('請選擇部位',_buttons)
                        callback(response)
                    },
                    (err)=>{
                        response={'text':`${err}`}
                        fail(response)
                    })                                        
                    break
            }
            break
    }    
}