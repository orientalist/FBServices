$(document).ready(() => {
    $('select[name="type"]').change(function () {
        $(this).closest('.action').children('.pTitle').hide()
        $(this).closest('.action').children('.web_url').hide()
        $(this).closest('.action').children('.pPayload').hide()
        switch ($(this).val()) {
            case 'postback':
                $(this).closest('.action').children('.pTitle').show()
                $(this).closest('.action').children('.web_url').hide()
                $(this).closest('.action').children('.pPayload').show()
                break
            case 'web_url':
                $(this).closest('.action').children('.pTitle').show()
                $(this).closest('.action').children('.web_url').show()
                break
        }
    })
    $('#aCreate').click(function (e) {
        e.preventDefault()
        var data = {
            bot_id: $('#bot_id').val(),
            locale: $('#locale').val(),
            composer_input_disabled: $('#composer_input_disabled').val(),
            actions: []
        }
        $.each($('.action'), (index, value) => {
            if ($(value).find('select[name="type"]').val() != '0') {
                var _action;
                switch ($(value).find('select[name="type"]').val()) {
                    case 'postback':
                        _action = {
                            type: 'postback',
                            title: $(value).find('input[name="title"]').val(),
                            payload: $(value).find('input[name="payload"]').val()
                        }
                        break
                    case 'web_url':
                        _action = {
                            type: 'web_url',
                            title: $(value).find('input[name="title"]').val(),
                            url: $(value).find('input[name="url"]').val(),
                            webview_height_ratio: $(value).find('select[name="webview_height_ratio"]').val()
                        }
                        break
                }
                data.actions.push(_action)
            }
        })
        if (data.bot_id <= 0) {
            alert('未選擇機器人')
            return
        }
        if (data.actions.length <= 0) {
            alert('未選擇動作')
            return
        }
        var ok = true
        $.each(data.actions, (index, value) => {
            if (value.title.length <= 0) {
                alert('未輸入標題名稱')
                ok = false
            }
            switch (value.type) {
                case 'postback':
                    if (value.payload.length <= 0) {
                        alert('未輸入回傳資料')
                        ok = false
                    }
                    break
                case 'web_url':
                    if (value.url.length <= 0) {
                        alert('未輸入url')
                        ok = false
                    }
                    break
            }
        })
        if (ok) {
            $.ajax({
                url: '/PersistMenu',
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
        }
    })
})