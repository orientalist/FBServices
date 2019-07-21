var connection = require('./Connection')
var readLine = require('readline')
var fs = require('fs')

const readLineInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

var GetCommand = (finish) => {
    readLineInterface.question('Please insert your command\n', (cmd) => {
        try {
            switch (cmd) {
                case 'uet':
                    try{

                        var _promise=connection.RecordsByUsers.find(
                            {
                                psid:'2208236499223584',
                                equipmentId:'5d26e38aea8db21f505e2994',
                                recordsByPeriod: {
                                    $gt: []
                                }
                            }
                        )
    
                        _promise.then(
                            (data)=>{
                                console.log(data)
                                finish(data)
                            },
                            (err)=>{
                                console.log(err)
                                finish(err)
                            }
                        )
                    }
                    catch(e){
                        finish(e)
                    }
                    break
                case 'record':
                    var d = new Date()
                    var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                    var nd = new Date(utc + (3600000 * 8))
                    nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())
                    console.log(new Date('2019-07-10T00:00:00.000+00:00'))
                    var promise = connection.RecordsByUsers.find({
                        psid: '2208236499223584',
                        dateTime: new Date('2019-07-10T00:00:00.000+00:00'),
                        equipmentId: '5d2169a0ac36350000d8ed2c'
                    })

                    promise.then(
                        (result) => {
                            console.log(result)
                            if (result.length > 0) {
                                console.log('Found records\n')
                                console.log(result[0].recordsByPeriod)
                            }
                            else {
                                console.log('Not found')
                            }
                            finish('Query Success')
                        },
                        (err) => {
                            finish(err)
                        }
                    )
                    break
                case 'insert':
                    var d = new Date()
                    var utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                    var nd = new Date(utc + (3600000 * 8))
                    nd = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate())


                    var promise = connection.RecordsByUsers.update(
                        {
                            dateTime: nd,
                            psid: '2208236499223584',
                            equipmentId: '5d2450ced6caa0274e1634a6',
                            equipmentName: '雙槓屈臂伸'
                        },
                        {
                            $push: {
                                recordsByPeriod: {
                                    weight: 88,
                                    times: 12
                                }
                            }
                        },
                        { upsert: true }
                    )
                    promise.then(
                        (result) => {
                            finish(result)
                        },
                        (err) => {
                            finish(err)
                        }
                    )
                    break
                case 'remove':
                    console.log('"abc"'.replace(/"/g, ''))
                    finish('ok')
                    break
                case 'best':
                    var nd = new Date('2019-07-12T00:00:00.000+00:00')

                    var promise = connection.RecordsByUsers.update(
                        {
                            psid: '2208236499223584',
                            equipmentId: '5d1c44214eebee00000a0586',
                            equipmentName: '45°臥推',
                            dateTime: nd
                        },
                        {
                            $push: {
                                recordsByPeriod: {
                                    weight: 31,
                                    times: 12
                                }
                            }
                        },
                        { upsert: true }
                    )

                    promise.then(
                        (success) => {
                            var promise = connection.BestRecords.find(
                                {
                                    psid: '2208236499223584',
                                    'records.equipmentId': '5d1c44214eebee00000a0586'
                                },
                                {
                                    _id: 0,
                                    'records.$': 1
                                }
                            )

                            return promise
                        },
                        (err) => {
                            finish(err)
                        }
                    ).then(
                        (record) => {
                            if (record.length > 0) {
                                var weight = record[0].records[0].weight
                                if (31 > weight) {

                                    var promise = connection.BestRecords.update(
                                        {
                                            psid: '2208236499223584',
                                            'records.equipmentId': '5d1c44214eebee00000a0586'
                                        }, {
                                            $set: {
                                                'records.$.weight': 31,
                                                'records.$.times': 12,
                                                'records.$.dateTime': nd
                                            }
                                        }
                                    )
                                    return promise
                                } else {
                                    finish('not bigger')
                                }
                            } else {
                                var promise = connection.BestRecords.update(
                                    {
                                        psid: '2208236499223584',
                                    },
                                    {
                                        $push: {
                                            records: {
                                                equipmentId: '5d1c44214eebee00000a0586',
                                                equipmentName: '45°臥推',
                                                weight: 31,
                                                times: 12,
                                                dateTime: nd
                                            }
                                        }
                                    }
                                )

                                return promise
                            }
                        },
                        (err) => {
                            finish(err)
                        }
                    ).then(
                        (result) => {
                            finish(result)
                        },
                        (err) => {
                            finish(err)
                        }
                    )
                    break
                case 'lt':
                    var promise = connection.BestRecords.find(
                        {
                            psid: '2208236499223584',
                            records: {
                                $elemMatch: {
                                    equipmentId: '5d26e25dea8db21f505e2993',
                                    weight: {
                                        $gt: 40
                                    }
                                }
                            }
                        }
                    )
                    promise.then(
                        (result) => {
                            finish(result)
                        },
                        (err) => {
                            finish(result)
                        }
                    )
                    break
                case 'init':
                    var promise = new connection.BestRecords({
                        psid: '2208236499223584'
                    }).save()

                    promise.then(
                        (success) => {
                            finish(success)
                        },
                        (err) => {
                            finish(err)
                        }
                    )
                    break
                case 'pull':
                    var promise = connection.BestRecords.update(
                        {
                            psid: '2208236499223584'
                        },
                        {
                            $pull: {
                                records: {
                                    equipmentId: '5d2169a0ac36350000d8ed2c'
                                }
                            }
                        }
                    )
                    promise.then(
                        (success) => {
                            console.log('succ')
                            finish(success)
                        },
                        (err) => {
                            console.log('err')
                            finish(err)
                        }
                    )
                    break
                case 'near':

                    var nd = new Date('2019-07-18T00:00:00.000+00:00')

                    var promise = connection.RecordsByUsers.find(
                        {
                            psid: '2208236499223584',
                            equipmentId: '5d1c44214eebee00000a0586',
                            recordsByPeriod: {
                                $gt: []
                            },
                            dateTime: {
                                $lt: nd
                            }
                        }
                    ).sort({ dateTime: -1 }).limit(1).select({ dateTime: 1, recordsByPeriod: 1, _id: 0 }).lean()

                    promise.then(
                        (records) => {
                            if (records.length > 0) {
                                finish(records)
                                //finish(records[0].recordsByPeriod)
                            } else {
                                console.log('no data')
                                finish([])
                            }
                        },
                        (err) => {
                            finish(err)
                        }
                    )
                    break
                default:
                    finish('Unknown Command')
                    break
            }
        } catch (e) {
            finish(e)
        }
    })
}

var IsContinue = (_continue, _shutdown) => {
    readLineInterface.question('Do you want to continue another test?(y/n)', (isContinue) => {
        if (isContinue === 'y') {
            _continue()
        } else {
            _shutdown()
        }
    })
}

var TestCenterLoop = () => {
    GetCommand(
        (finish) => {
            console.log(finish)
            if (finish === 'Unknown Command') {
                TestCenterLoop()
            } else {
                IsContinue(
                    () => {
                        TestCenterLoop()
                    },
                    () => {
                        console.log('Test Center is closing...')
                        readLineInterface.close()
                        process.exit()
                    }
                )
            }
        }
    )
}

var InitializeTestCenter = () => {
    console.log('Test center is starting...')
    console.log('Welcome to Test Center')
    TestCenterLoop()
}

InitializeTestCenter()