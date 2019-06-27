exports.Get={
    postback:(title,payload)=>{
        var model={
            type:'postback',
            title:title,
            payload:payload
        }
        return model
    },
    web_url:(title,url,height='',extension=null,fallback_url='',share_button='')=>{
        var model={
            type:'web_url',
            title:title,
            url:url
        }
        if(height){
            model.webview_height_ratio=height
        }
        if(extension){
            model.messenger_extensions=extension
        }
        if(fallback_url){
            model.fallback_url=fallback_url
        }
        if(share_button){
            model.webview_share_button=share_button
        }
        return model
    }
}