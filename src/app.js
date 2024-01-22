const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(express.static("src/public/static"))

app.set("view engine","ejs")
app.set("views",path.join(__dirname+"/public/views"))


function startServer(){
    try{
        app.listen(process.env.PORT,()=>{
            console.log(`Express app running on port ${process.env.PORT}`)
        })
    }catch(e){
        console.log(`This Express Server is not running because : ${e}`)
    }
}
startServer()