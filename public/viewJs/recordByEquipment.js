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
    $('canvas').remove();
    $('#divWeight').append($('<canvas>',{
        class:'chartByWeight'        
    }));
    $('#divTimes').append($('<canvas>',{
        class:'chartByTimes'        
    }));
    $('#divEfficiency').append($('<canvas>',{
        class:'chartByEfficiency'        
    }));
    var data = {
        psid: psid,
        eqid: equipmentId,
        dtid: queryDate
    }

    $.ajax({
        url: "/DataByDate",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).done((result) => {
        if (result.code===1&&result.data.length > 0) {            
            var dataByWeight=[]
            var dataByTimes=[]
            var dataByEffifiency=[]
            
            for(i=0;i<result.data.length;i++){
                dataByWeight.push({period:(i+1),value:result.data[i].weight})
                dataByTimes.push({period:(i+1),value:result.data[i].times})
                dataByEffifiency.push({period:(i+1),value:(result.data[i].weight*result.data[i].times)})
            }            
            fnInitializeChart('重量',dataByWeight,'Weight')
            fnInitializeChart('次數',dataByTimes,'Times')
            fnInitializeChart('績效',dataByEffifiency,'Efficiency')
        }
    })
}
var fnInitializeChart = (_label, data, type) => {
    var ctx = document.getElementsByClassName(`chartBy${type}`)
    var periods = []
    var values = []
    periods.push(0)
    values.push(0)

    $.each(data, (index, value) => {
        periods.push(value.period)
        values.push(value.value)
    })

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: periods,
            datasets: [{
                label: _label,
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: values,
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'number'
                    },
                    gridLines: {
                        display: true,
                        drawBorder: true
                    }
                }],
                yAxes: [{
                    ticks: {
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return `${value}`;
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: true,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return `${datasetLabel}:${tooltipItem.yLabel}`;
                    }
                }
            }
        }
    })
}