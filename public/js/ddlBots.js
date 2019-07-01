$(document).ready(function () {
    $('.dropdown-item').click(function (e) {
        e.preventDefault()
        $("#choosenBot").text($(this).text())
        $("#bot_id").val($(this).attr('data-bid'))
    })
})