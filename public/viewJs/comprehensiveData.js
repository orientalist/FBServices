$(document).ready(() => {
    fnGetComprehensiveData($('input[name="psid"]').val())
})
var fnGetComprehensiveData = (psid) => {
    $.ajax({
        url: `/ComprehensiveData?pid=${psid}&type=workout`,
        type: 'POST',
    }).done((result) => {
        if (result.code === 1) {
            var Equipments = result.data.Equipments
            var Records = result.data.Records
            var TotalCounts = 0
            $.each(Equipments, (index, eqs) => {
                switch (eqs._id) {
                    case 'arm':
                        eqs.Partition = '手部肌群'
                        break
                    case 'chest':
                        eqs.Partition = '胸部肌群'
                        break
                    case 'back':
                        eqs.Partition = '背部肌群'
                        break
                    case 'leg':
                        eqs.Partition = '腿部肌群'
                        break
                }
                var _eqs = eqs
                _eqs.SubEquipments = []
                _eqs.TotalCounts = 0
                $.each(eqs.equipments, (index, eq) => {
                    var _eq = Records.find(r => r._id._id === eq)
                    _eqs.SubEquipments.push({ _id: _eq._id._id, name: _eq._id.equipmentName, value: _eq.value })
                    _eqs.TotalCounts += _eq.value
                    TotalCounts += _eq.value
                })
            })
            var colors = fnGenerateColors(Equipments.length)

            fnInitializePieChart(
                (Equipments.map((o) => { return o.Partition })),
                (Equipments.map((o) => { return Math.floor((o.TotalCounts / TotalCounts) * 100) })),
                colors,
                'Comprehensive'
            )
            $.each(Equipments, (index, value) => {
                var newDiv = $('#divHidden .divBorder').clone()
                var newCanvas = $('<canvas>', {
                    id: `pie${value._id}`,
                    style: 'width:80vw;height:70vh;'
                })
                $(newDiv).find('.card-body').append(newCanvas)
                $(newDiv).find('.spPartition').text(value.Partition)
                $('#divContainer').append(newDiv);
                var colors = fnGenerateColors(value.SubEquipments.length)
                fnInitializePieChart(
                    (value.SubEquipments.map((o) => { return o.name })),
                    (value.SubEquipments.map((o) => { return o.value })),
                    colors,
                    value._id
                )
            })
        }
    })
}
var fnInitializePieChart = (partitions, data, colors, type) => {
    var ctxP = document.getElementById(`pie${type}`).getContext('2d')
    var pieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
            labels: partitions,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true
        }
    })
}
var fnGenerateColors = (count) => {
    var outputColors = []
    var letters = '0123456789ABCDEF'
    for (i = 1; i <= count; i++) {
        var colorStr = ''
        for (be = 0; be < 6; be++) {
            colorStr += letters[(Math.floor(Math.random() * 16))]
        }
        outputColors.push(`#${colorStr}`)
    }
    return outputColors
}