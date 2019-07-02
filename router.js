var express = require('express')
var router = express.Router()
var connection = require('./models/db/Connection')
var encCenter=require('./models/Encryption/EncryptionCenter')

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
            var funcs
            if (webhook_event.message) {
                funcs = require('./models/functions/MessageFunctions').
                    process(sender_psid, webhook_event.message)
            } else if (webhook_event.postback) {
                funcs = require('./models/functions/PostbackFunctions').
                    process(sender_psid, webhook_event.postback)
            }
        })
        res.status(200).send('EVENT_RECEIVED')
    } else {
        res.sendStatus(404)
    }
})

router.get('/record', (req, res) => {
    var func = require('./models/functions/OfficialAPIs')
    func.Initialize(require('./models/functions/MessengerProfile').ACCESS_TOKEN)
    var userProfile
    var getProfile = func.GetUserProfile_Promise(req.query['pid'])
    getProfile.then(
        (data) => {            
            userProfile =JSON.parse(data)
            userProfile.id=encCenter.Encrypt_AES192(userProfile.id)
            switch (req.query['type']) {
                case 'workout':
                    var eqBl = require('./models/db/functions/equipmentBL')
                    eqBl.GetEquipments(connection, req.query['subPartition'],
                        (err) => {
                            res.sendStatus(404).send(err)
                        },
                        (promise) => {
                            promise.then(
                                (equipments) => {
                                    res.render('record.html', { User: userProfile, Equipments: equipments })
                                },
                                (err) => {
                                    res.sendStatus(404).send(err)
                                })
                        }
                    )
                    break
            }
        },
        (err) => {
            res.sendStatus(404).send(err)
        })
})

router.post('/record', (req, res) => {
    var body = req.body
    var recordBL = require('./models/db/functions/recordBL')
    recordBL.SaveRecord(body.psid, body.equipment, body.weight, body.times, connection,
        (validateMsg) => {
            res.status(200).send({code:500})
        }, (savePromise) => {
            savePromise.then((result) => {
                res.status(200).send({ code: 200 })
            },
                (err) => {
                    res.status(200).send({code:500})
                })
        })
})

router.get('/test', (req, res) => {
    res.sendStatus(200)
})

module.exports = router