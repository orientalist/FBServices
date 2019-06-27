'use strict'

const 
    express=require('express'),
    bodyParser=require('body-parser'),
    path=require('path'),
    app=express().use(bodyParser.json())
    var router=require('./router')
    
    app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
    app.engine('html',require('express-art-template'))
    app.set('views',path.join(__dirname,'./views'))

    app.use(router)

    app.listen(process.env.PORT||3000,()=>console.log('Server is reqdy'))