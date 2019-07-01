var officialAPIs=require('./OfficialAPIs')
officialAPIs.Initialize('EAAgXHuY3iVsBAK55e89rxKYW6FbZCDLZA0v4lq14ZB7JbNt6coLvBZAbftXzrIUS27mfeSwXabEFLGIgwqplu2wAaxxSIqc3tj97H6x1DdvFd9bZCaoKQHlEdmxY2ezZCH1kIsRKK5lqWaZAgEUbTMeqO5Sxij7ZBS5sGu09ZBnEEVQZDZD')
var functionsByCmd=require('./FunctionsByCmd')

exports.process=(sender_psid,received_postback)=>{
    let response
    var _request=JSON.parse(received_postback.payload)
    switch(_request.cmd){
        case 'Welcome':
            response={'text':'歡迎來到霸特健身助手'}
            break
        case 'record':
            response=functionsByCmd.Record(_request,sender_psid)
            officialAPIs.SendAPI(sender_psid,response)
            break
    }
}