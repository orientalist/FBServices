var officialAPIs=require('./OfficialAPIs')
officialAPIs.Initialize('EAAgXHuY3iVsBAK55e89rxKYW6FbZCDLZA0v4lq14ZB7JbNt6coLvBZAbftXzrIUS27mfeSwXabEFLGIgwqplu2wAaxxSIqc3tj97H6x1DdvFd9bZCaoKQHlEdmxY2ezZCH1kIsRKK5lqWaZAgEUbTMeqO5Sxij7ZBS5sGu09ZBnEEVQZDZD')

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