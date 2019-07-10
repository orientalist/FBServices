var connection = require('./Connection')
var readLine = require('readline')

const readLineInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

var GetCommand = (finish) => {
    readLineInterface.question('Please insert your command\n', (cmd) => {
        try {
            switch (cmd) {
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
                    console.log('"abc"'.replace(/"/g,''))
                    finish('ok')
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