$(document).ready(() => {
    $('#btnAddInput').click(function (e) {
        e.preventDefault()
        if ($('.whiteUrl').length > 50) {
            alert('白名單url不可超過50個')
        } else {
            var urlInput = $('#pInput').clone()
            $(urlInput).removeAttr('id')
            $(urlInput).show()
            $(urlInput).appendTo('#divWhiteLists')
        }
    })
})