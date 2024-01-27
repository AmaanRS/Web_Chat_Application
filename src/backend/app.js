const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const Routes = require("./Routes/Router")
const { connectDB } = require("./DB/db")
require("dotenv").config()

const app = express()

app.use(cors({ credentials:true,origin:process.env.ORIGIN }))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(express.static(path.join(__dirname+"public/static")))

app.set("view engine","ejs")
app.set("views",path.join(__dirname+"/public/views"))


app.use("/",Routes)

async function startServer(){
    try{
        // Write the database url in the env file
        await connectDB(process.env.MONGO_URI).then(()=>{
            console.log("Database is connected")
            app.listen(process.env.PORT,()=>{
                console.log(`Express app running on port ${process.env.PORT}`)
            })
        }).catch((err)=>{
            if(err) console.log(err.message)
        })
    }catch(e){
        console.log(`This Express Server is not running because : ${e}`)
    }
}
startServer()