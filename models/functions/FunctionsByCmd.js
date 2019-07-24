var templates = require('../../models/MessageModels/Template')
var buttons = require('../../models/MessageModels/Buttons')
var encCenter = require('../Encryption/EncryptionCenter')
var equipBl = require('../db/functions/equipmentBL')
var recordBl = require('../../BL/Record/RecordBL')

exports.Record = (request, sender_psid, conn, callback, fail) => {
    var response = null
    var url = `https://fbwebhook-240909.appspot.com/record?pid=${encCenter.Encrypt_AES192(sender_psid)}`
    switch (request.type) {
        case 'workout':
            url += '&type=workout'
            url += '&subPartition='
            var _buttons = []
            equipBl.GetSubPartitions(conn, request.partition,
                (positions) => {
                    positions.forEach(element => {
                        _buttons.push(buttons.Get.web_url(element.subPartitions.groupName, `${url}${element.subPartitions.groupSn}`, 'full'))
                    });
                    response = templates.Buttons.template('請選擇部位-開啟記錄頁', _buttons)
                    callback(response)
                },
                (err) => {
                    response = { 'text': `${err}` }
                    fail(response)
                })
            break
    }
}

exports.Data = (request, sender_psid, conn, callback, fail) => {
    var response = null
    var url = `https://fbwebhook-240909.appspot.com/data?pid=${encCenter.Encrypt_AES192(sender_psid)}`
    switch (request.type) {
        case 'workout':
            url += '&type=workout'
            url += '&subPartition='
            recordBl.GetEquipmentHasRecord(conn, sender_psid,
                (equipments) => {
                    var totalCount = (equipments.length / 10)
                    if (equipments.length % 10 != 0) {
                        totalCount += 1
                    }
                    for (be = 1; be <= totalCount; be++) {
                        var elements = []
                        for (i = (be * 10 - 10); i <= (be * 10 - 1); i++) {
                            if (equipments[i]) {
                                var button = buttons.Get.web_url('查看紀錄', `${url}${equipments[i]._id}`, 'full')
                                var _ele = templates.Generic.element(equipments[i].name, equipments[i].picUrl, '', null, [button])
                                //var _template = templates.Generic.template(_ele)
                                elements.push(_ele[0])
                            }
                        }
                        response = templates.Carousel.template(elements)
                        //console.log(response)
                        callback(response)
                    }
                },
                (err) => {
                    response = { 'text': `${err}` }
                    fail(response)
                }
            )
            break
    }
}