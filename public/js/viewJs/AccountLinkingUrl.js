$(document).ready(() => {
    $('#aCreate').click((e) => {
        e.preventDefault()
        var data = {
            bot_id:$('#bot_id').val(),
            account_link_url:$('input[name="accountLinkUrl"]').val()
        }
        if (data.bot_id.length <= 0) {
            alert('未選擇機器人')
            return
        }
        if (data.account_link_url.length <= 0) {
            alert('未輸入網址')
            return
        }
        $.ajax({
            url: 'AccountLinkingUrl',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: data })
        }).done((result) => {
            if(result.code===1){
                alert('修改成功')
            }else{
                alert(result.data)
            }
        })
    })
})