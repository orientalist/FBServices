var request = require('request')
var ceyptCenter=require('../Encryption/EncryptionCenter')
var access_token

exports.Initialize = (_access_token) => {
    access_token = _access_token
}

exports.SendAPI = (sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': {
            'access_token': access_token
        },
        'method': 'POST',
        'json': request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('success')
        } else {
            console.log('fail')
        }
    })
}

exports.GetUserProfile = (psid, callback, callFail) => {
    request({
        'uri': `https://graph.facebook.com/${psid}?fields=first_name,last_name,profile_pic,gender&access_token=${access_token}`,
        'method': 'GET'
    }, (err, res, body) => {
        if (!err) {
            callback(body)
        } else {
            callFail(res)
        }
    })
}

exports.GetUserProfile_Promise = (psid) => {
    return new Promise((resolved, rejected) => {
        request({
            'uri': `https://graph.facebook.com/${ceyptCenter.Decrypt_AES192(psid)}?fields=first_name,last_name,profile_pic,gender&access_token=${access_token}`,
            'method': 'GET'
        },(err,res,body)=>{
            if(!err){
                resolved(body)
            }else{
                rejected(res)
            }
        })
    })
}