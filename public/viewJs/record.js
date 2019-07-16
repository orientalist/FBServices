var flkty = null
var dataTable = null
var dataTable_Best = null
$(document).ready(() => {
    var carousel = $('.main-carousel').flickity({
        cellAlign: 'left',
        contain: true,
        on: {
            'change': () => {
                fnGetRecordOfEquipment()
            }
        }
    })
    flkty = carousel.data('flickity')
    $('#aSend').click(function (e) {
        e.preventDefault()
        var data = {
            psid: $('input[name="psid"]').val(),
            equipment: $(flkty.selectedElement).attr('data-eqid'),
            equipmentName: $(flkty.selectedElement).attr('data-equipName'),
            weight: parseInt($('input[name="weight"]').val()),
            times: parseInt($('input[name="times"]').val())
        }
        if (data.equipment.length <= 0) {
            alert('請選擇器材')
            return
        }
        if (isNaN(data.weight)) {
            alert('請輸入重量')
            return
        }
        if (isNaN(data.times)) {
            alert('請輸入每組次數')
            return
        }
        if (data.weight <= 0) {
            alert('請勿輸入小於或等於零的數值')
            return
        }
        if (data.times <= 0) {
            alert('請勿輸入小於或等於零的數值')
            return
        }
        $.ajax({
            url: '/record',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done((result) => {
            if (result.code === 200) {
                fnGetRecordOfEquipment()
                $('input[name="weight"]').val('')
                $('input[name="times"]').val('')

            } else {
                alert('伺服器忙碌中,請稍後再試')
            }
        })
    })
    fnInitializeTable()
    fnGetRecordOfEquipment()
    $('#btnDeleteBest_Pre').click(function (e) {
        var equipname = $(flkty.selectedElement).attr('data-equipName')
        $('#spDeleteBestEquip').text(equipname)
    })
    $('#btnDeleteBest_Aft').click(function (e) {
        e.preventDefault()
        var psid = $('input[name="psid"]').val()
        var equipId = $(flkty.selectedElement).attr('data-eqid')
        var data = {
            psid: psid,
            equipmentId: equipId
        }
        $.ajax({
            url: "/bestRecord",
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(data)
        }).done((result) => {
            if (result.code === 1) {
                fnGetBestRecordOfEquipment()
                $('#deleteBestRecord').modal('toggle')
            } else {
                alert('伺服器忙碌中,請稍後再試')
            }
        })
    })
})
var fnGetRecordOfEquipment = () => {
    var eqid = $(flkty.selectedElement).attr('data-eqid')
    var psid = $('input[name="psid"]').val()
    var url = `/GetRecordOfEquipment?eqid=${eqid}&psid=${psid}`
    dataTable.ajax.url(url).load()
    fnGetBestRecordOfEquipment()
}
var fnInitializeTable = () => {
    dataTable = $('#tableTodayRecord').DataTable({
        'paging': false,
        'info': false,
        'searching': false,
        'language':
        {
            'emptyTable': '本日尚未有紀錄'
        },
        'columns': [
            { data: 'period_order' },
            { data: 'weight' },
            { data: 'times' },
            {
                data: null,
                className: 'center',
                defaultContent: ' <a href="#" data-toggle="modal" data-target="#deleteRecord" class="btn btn-danger btn-circle btn-sm"><i class="fas fa-trash"></i></a>'
            }
        ]
    })
    dataTable_Best = $('#tableBestRecord').DataTable({
        'paging': false,
        'info': false,
        'searching': false,
        'sorting': false,
        'language':
        {
            'emptyTable': '該項目尚未有最佳紀錄'
        },
        'columns': [
            { data: 'dateTime' },
            { data: 'weight' },
            { data: 'times' }
        ]
    })
    $('.noArrow').css('background', 'none')
}
var fnGetBestRecordOfEquipment = () => {
    $('#btnDeleteBest_Pre').hide()
    var eqid = $(flkty.selectedElement).attr('data-eqid')
    var psid = $('input[name="psid"]').val()
    var url_best = `/GetBestRecordOfEquipment?eqid=${eqid}&psid=${psid}`

    dataTable_Best.ajax.url(url_best).load((result) => {
        if (result.data.length > 0) {
            $('#btnDeleteBest_Pre').show()
        }
    })

}