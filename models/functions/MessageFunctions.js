var officialAPIs=require('./OfficialAPIs')
officialAPIs.Initialize(require('../functions/MessengerProfile').ACCESS_TOKEN)

exports.process=(sender_psid,received_message)=>{
    let response
    if(received_message.text){
        switch(received_message.text){
            case 'test':
                response={
                    'text':'success'
                }
                break
            default:
                break
        }
    }else if(received_message.attachments){

    }
    officialAPIs.SendAPI(sender_psid,response)
}