var request=require('request')
var access_token

exports.Initialize=(_access_token)=>{
    access_token=_access_token
}

exports.SendAPI=(sender_psid,response)=>{
    let request_body={
        "recipient":{
            "id":sender_psid
        },
        "message":response
    }
    
    request({
        'uri':'https://graph.facebook.com/v2.6/me/messages',
        'qs':{
            'access_token':access_token
        },
        'method':'POST',
        'json':request_body
    },(err,res,body)=>{
        if(!err){
            console.log('success')
        }else{
            console.log('fail')
        }
    })
}