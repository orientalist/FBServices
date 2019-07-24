var request = require('request')
var access_token='EAAgXHuY3iVsBAK55e89rxKYW6FbZCDLZA0v4lq14ZB7JbNt6coLvBZAbftXzrIUS27mfeSwXabEFLGIgwqplu2wAaxxSIqc3tj97H6x1DdvFd9bZCaoKQHlEdmxY2ezZCH1kIsRKK5lqWaZAgEUbTMeqO5Sxij7ZBS5sGu09ZBnEEVQZDZD'

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
    //console.log(JSON.stringify(request_body))
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
            'uri': `https://graph.facebook.com/${psid}?fields=first_name,last_name,profile_pic,gender&access_token=${access_token}`,
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