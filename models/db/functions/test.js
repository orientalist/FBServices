var conn=require('../Connection')
var eqbl=require('./equipmentBL')
var buttons=require('../../../models/MessageModels/Buttons')

eqbl.GetSubPartitions(conn,'chest',
(eqs)=>{
    var _buttons=[]
    eqs.forEach(element => {
        _buttons.push(buttons.Get.web_url(element.groupName,`${'url'}${element.groupSn}`,'tall'))
    });
    console.log(_buttons)
},
(err)=>{
    console.log(err)
})