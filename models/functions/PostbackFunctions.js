var officialAPIs=require('./OfficialAPIs')
officialAPIs.Initialize(require('../functions/MessengerProfile').ACCESS_TOKEN)
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