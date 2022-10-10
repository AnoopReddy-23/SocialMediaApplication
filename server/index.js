const exp=require('express') 
const app=exp() 
const mongoose=require('mongoose')

const {DATABASE_CONNECTION}=require('./config')

//import path module (core module)
const path=require('path')
//connect build of react app with nodejs
app.use(exp.static(path.join(__dirname,'../client/build')))

mongoose.connect(DATABASE_CONNECTION)

mongoose.connection.on('connected',()=>{
    console.log("DataBase connection success")
})

mongoose.connection.on('error',(error)=>{
    console.log("Error occured ", error)
})

require('./models/user_model')
require('./models/post_model')

app.use(exp.json())
app.use(exp.urlencoded({extended: true}));
app.use(require('./routes/authentication'))
app.use(require('./routes/postRoute'))
app.use(require('./routes/userRoute'))


//dealing with page refersh
app.use('*',(request,response)=>{
    response.sendFile(path.join(__dirname,'../client/build/index.html'))
})

//handling invalid path by using middleware
app.use((request,response,next)=>{
    response.send({message:`Path ${request.url} is Invalid`});
})



//Error handling middleware
app.use((error,request,response,next)=>{
    response.send({message:`Error occured ${error.message}`,reason:`${error.message}`})
})


app.listen(4000,()=>console.log(`Server running on port number 4000`))