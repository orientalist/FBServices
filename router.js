var express = require('express')
var router = express.Router()
var connection = require('./models/db/Connection')
var encCenter = require('./models/Encryption/EncryptionCenter')
var msgFunc = require('./models/functions/MessageFunctions')
var postFunc = require('./models/functions/PostbackFunctions')

var recordBl = require('./BL/Record/RecordBL')

router.get('/webhook', (req, res) => {
    let verify_token = '123456789'

    let mode = req.query['hub.mode'],
        token = req.query['hub.verify_token'],
        challenge = req.query['hub.challenge']

    if (mode && token) {
        if (mode === 'subscribe' && token === verify_token) {
            res.status(200).send(challenge)
        } else {
            res.sendStatus(403)
        }
    }
})

router.post('/webhook', (req, res) => {
    let body = req.body
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0]
            let sender_psid = webhook_event.sender.id
            if (webhook_event.message) {
                msgFunc.process(sender_psid, webhook_event.message)
            } else if (webhook_event.postback) {
                postFunc.process(sender_psid, webhook_event.postback, connection)
            }
        })
        res.status(200).send('EVENT_RECEIVED')
    } else {
        res.sendStatus(404)
    }
})

router.get('/record', (req, res) => {
    try {
        recordBl.GetUserProfile(req.query['pid'],
            (profile) => {
                var _profile = JSON.parse(profile)
                _profile.id = encCenter.Encrypt_AES192(_profile.id)
                switch (req.query['type']) {
                    case 'workout':
                        recordBl.GetEquipments(connection, req.query['subPartition'],
                            (_equipments) => {
                                if (_equipments.length > 0 && _equipments[0].equipments.length > 0) {
                                    res.render('record.html', { User: _profile, Equipments: _equipments[0].equipments })
                                }
                                else {
                                    res.render('EquipmentNotFound.html', { User: _profile })
                                }
                            },
                            (err) => {
                                res.status(200).send(err)
                            })
                        break
                }
            },
            (err) => {
                res.status(200).send(err)
            })
    }
    catch (e) {
        res.status(200).send(e)
    }
})

router.post('/record', (req, res) => {
    try {
        var body = req.body
        recordBl.SaveRecord(body.psid, body.equipment, body.equipmentName, body.weight, body.times, connection,
            (err) => {
                res.status(200).send({ code: 500 })
            },
            (result) => {
                res.status(200).send({ code: 200 })
            })
    } catch (e) {
        res.status(200).send({ code: 500 })
    }
})

router.post('/GetRecordOfEquipment', (req, res) => {
    try {
        recordBl.GetRecordOfEquipment(connection, req.body,
            (records) => {
                //console.log(records)
                res.status(200).send(records)
            },
            (err) => {
                console.log(err)
                res.status(200).send('err')
            }
        )
    }
    catch (e) {
        res.send('err')
    }
})

router.get('/test', (req, res) => {
    res.sendStatus(200)
})

module.exports = router