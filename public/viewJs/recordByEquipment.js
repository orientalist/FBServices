var queryDate = null
var lastDate = null
$(document).ready(() => {
    var equipmentId = $('input[name="EquipmentId"]').val();
    var psid = $('input[name="psid"]').val();

    $('.dropdown-item').click(function (e) {
        lastDate = queryDate
        e.preventDefault()
        $('#queryDate').text($(this).attr('data-date'))
        queryDate = $(this).attr('data-id')
        if (queryDate != lastDate) {
            fnQueryData(psid, equipmentId, queryDate)
        }
    })

})
var fnQueryData = (psid, equipmentId, queryDate) => {
    var data = {
        psid: psid,
        eqid: equipmentId,
        dtid: queryDate
    }

    $.ajax({
        url: "/DataByDate",
        type:'GET',
        data:JSON.stringify(data)
    }).done((result) => {
        console.log(result)
    })
}