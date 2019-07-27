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

router.get('/data',(req,res)=>{
    try{
        recordBl.GetUserProfile(req.query['pid'],
            (profile)=>{
                var _profile=JSON.parse(profile)
                var originalPsid=_profile.id
                _profile.id=encCenter.Encrypt_AES192(_profile.id)
                switch(req.query['type']){
                    case 'workout':
                        recordBl.GetEquipmentById(connection,req.query['subPartition'],
                            (equipment)=>{
                                recordBl.GetDatetimeOfEquipment(connection,req.query['subPartition'],originalPsid,
                                    (times)=>{                                  
                                        res.render('RecordByEquipment.html',{User:_profile,Equipment:equipment,RecordTimes:times})
                                    },
                                    (err)=>{
                                        res.status(200).send(err)
                                    }
                                )
                            },
                            (err)=>{
                                res.status(200).send(err)
                            }
                        )
                    break
                }
            },
            (err)=>{
                res.status(200).send(err)
            }
        )
    }
    catch(e){
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
                //console.log(result)
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
                res.status(200).send({ code: 1, data: records })
            },
            (err) => {
                res.status(200).send({ code: -1 })
            }
        )
    }
    catch (e) {
        res.status(200).send({ code: -1 })
    }
})

router.get('/GetRecordOfEquipment', (req, res) => {
    try {
        recordBl.GetRecordOfEquipment(connection, req.query['eqid'], req.query['psid'],
            (records) => {
                for (be = 0; be < records.length; be++) {
                    records[be].period_order = (be + 1)
                }
                res.status(200).send({ data: records })
            },
            (err) => {
                res.status(200).send({ data: [] })
            }
        )
    } catch (e) {
        res.status(200).send({ data: [] })
    }
})

router.get('/GetPreviousRecordOfEquipment',(req,res)=>{
    try{
        recordBl.GetPreviousRecordOfEquipment(connection,req.query['eqid'],req.query['psid'],
            (records)=>{
                for(be=0;be<records.length;be++){
                    records[be].period_order=(be+1)
                }
                
                res.status(200).send({data:records})
            },
            (err)=>{
                res.status(200).send({data:[]})
            }
        )
    }catch(e){
        res.status(200).send({data:[]})
    }
})

router.get('/GetBestRecordOfEquipment', (req, res) => {
    try {
        recordBl.GetBestRecordOfEquipment(connection, req.query['eqid'], req.query['psid'],
            (record) => {
                if (record.length > 0) {
                    var _record = record[0].records[0]
                    var recordTime = _record.dateTime
                    var recordTime_Str = `${recordTime.getFullYear()}/${recordTime.getMonth() + 1}/${recordTime.getDate()}`

                    res.status(200).send({
                        data: [{
                            dateTime: recordTime_Str,
                            weight: _record.weight,
                            times: _record.times
                        }]
                    })
                } else {
                    res.status(200).send({ data: [] })
                }
            },
            (err) => {
                res.status(200).send({ data: [] })
            }
        )
    } catch (e) {
        res.status(200).send({ data: [] })
    }
})

router.delete('/bestRecord', (req, res) => {
    try {
        var data = req.body
        recordBl.DeleteBestRecord(connection, data.psid, data.equipmentId,
            (success)=>{
                res.status(200).send({code:1})
            },
            (err)=>{
                res.status(200).send({code:-1})
            }
        )
        res.status(200)
    } catch (e) {
        res.status(200).send({ code: -1 })
    }
})

router.delete('/record',(req,res)=>{
    try{
        var data=req.body
        recordBl.DeleteRecord(connection, data.psid, data.id, data.equipmentId,
            (success) => {
                res.status(200).send({code:1})
            },
            (err) => {
                res.status(200).send({code:-1})
            }
        )
    }catch(e){
        res.status(200).send({code:-1})
    }
})

router.get('/test', (req, res) => {
    try {
        recordBl.GetUserProfile(req.query['pid'],
            (profile) => {
                var _profile = JSON.parse(profile)
                _profile.id = encCenter.Encrypt_AES192(_profile.id)
                res.render('chart.html', { User: _profile })
            },
            (err) => {
                res.status(200).send(err)
            })
    }
    catch (e) {
        res.status(200).send(e)
    }
})

router.post('/DataByDate',(req,res)=>{
    try{        
        var queryBody=req.body
        
        recordBl.GetDataByDate(connection,queryBody,
            (data)=>{
                res.status(200).send({code:1,data:data})
            },
            (err)=>{
                res.status(200).send({code:-1,data:err})
            }
        )
                
    }catch(e){
        res.status(200).send({code:-1,data:e})
    }
})

module.exports = router