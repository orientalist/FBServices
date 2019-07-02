exports.Generic = {
    element:(title, img_url = '', subtitle = '', default_action = null, buttons = null) => {
        var model=[
            {
                title:title
            }
        ]
        if(img_url){
            model[0].image_url=img_url
        }
        if(subtitle){
            model[0].subtitle=subtitle
        }
        if(default_action){
            model[0].default_action=default_action
        }
        if(buttons){
            model[0].buttons=buttons
        }
        return model
    },
    template:(elements) => {
        var model = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
        return model
    }
}
exports.List={
    element:(title,subtitle='',image_url='',default_action=null,buttons=null)=>{
        var model={
            title:title
        }
        if(subtitle){
            model.subtitle=subtitle
        }
        if(image_url){
            model.image_url=image_url
        }
        if(default_action){
            model.default_action=default_action
        }
        if(buttons){
            model.buttons=buttons
        }
        return model
    },
    template:(top_element_style,elements,bottomButton)=>{
        var model={
            attachment:{
                type:'template',
                payload:{
                    template_type:'list',
                    top_element_style:top_element_style,
                    elements:elements
                }
            }
        }
        if(bottomButton){
            model.attachment.payload.buttons=bottomButton
        }
        return model
    }
}
exports.Buttons={
    template:(title,buttons)=>{
        var model={
            attachment:{
                type:'template',
                payload:{
                    template_type:'button',
                    text:title,
                    buttons:buttons
                }
            }
        }
        return model
    }
}