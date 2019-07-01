$(document).ready(() => {
    $("#aCreate").click(function (e) {
        e.preventDefault()
        var data = {
            bot_id: $('#bot_id').val(),
            default: $('#default').val(),
            zh_TW: $('#zh_TW').val()
        }
        if (data.bot_id.length <= 0) {
            alert('未選擇機器人')
            return
        }
        if (data.default.length <= 0) {
            alert('未輸入預設歡迎語')
            return
        }
        if (data.zh_TW.length <= 0) {
            alert('未輸入中文歡迎語')
            return
        }
        $.ajax({
            url: 'ModifyWelcomePage',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: data })
        }).done((result) => {
            if (result.code === 1) {
                alert('修改成功!')
            } else {
                alert(result.data)
            }
        })
    })
})