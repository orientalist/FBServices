$(document).ready(()=>{
    $("#aCreate").click(function(e){
        e.preventDefault()
        var data={
            bot_id:$('#bot_id').val(),
            payload:$('input[name="payload"]').val()
        }
        if(data.bot_id.length<=0){
            alert('未選擇機器人')
            return
        }
        if(data.payload.length<=0){
            alert('未輸入回傳資訊')
            return
        }
        $.ajax({
            url:'GetStartedButtons',
            type:'POST',
            contentType:'application/json',
            data:JSON.stringify({data:data})
        }).done((result)=>{
            if (result.code === 1) {
                alert('修改成功!')
            } else {
                alert(result.data)
            }
        })
    })
})