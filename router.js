var express=require('express')
var router=express.Router()

router.get('/webhook',(req,res)=>{
    let verify_token='123456789'

    let mode=req.query['hub.mode'],
        token=req.query['hub.verify_token'],
        challenge=req.query['hub.challenge']

    if(mode&&token){
        if(mode==='subscribe'&&token===verify_token){
            res.status(200).send(challenge)
        }else{
            res.sendStatus(403)
        }
    }
})

router.post('/webhook',(req,res)=>{
    let body=req.body
    if(body.object==='page'){
        body.entry.forEach(function(entry){
            let webhook_event=entry.messaging[0]
            let sender_psid=webhook_event.sender.id
            var funcs
            if(webhook_event.message){
                funcs=require('./models/functions/MessageFunctions').
                process(sender_psid,webhook_event.message)
            }else if(webhook_event.postback){

            }
        })
        res.status(200).send('EVENT_RECEIVED')
    }else{
        res.sendStatus(404)
    }
})

router.get('/test',(req,res)=>{
    res.sendStatus(200)
})

module.exports=router