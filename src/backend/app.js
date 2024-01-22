const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const Routes = require("./Routes/Router")
const connectDB = require("./DB/db")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(express.static(path.join(__dirname+"public/static")))

app.set("view engine","ejs")
app.set("views",path.join(__dirname+"/public/views"))


app.use("/",Routes)

async function startServer(){
    try{
        //Write the database url in the env file
        // let isDbConnected = await connectDB(process.env.MONGO_URI)
        // if(isDbConnected){
        //     console.log("Database is connected")
            app.listen(process.env.PORT,()=>{
                console.log(`Express app running on port ${process.env.PORT}`)
            })
        // }else{
        //     console.log("The database is not connected")
        // }
    }catch(e){
        console.log(`This Express Server is not running because : ${e}`)
    }
}
startServer()