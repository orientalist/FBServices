var eq=require('./models/db/schemas/Equipment')

var e=eq.find()

e.then((eqs)=>{
    console.log(eqs)
},(err)=>{
    console.log(err)
})