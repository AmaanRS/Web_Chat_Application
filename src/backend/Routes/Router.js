const { login,signup,mainPage,getUserData,getAllUsersEmail} = require("../Controllers/Controller")
const express = require("express")
const { cookieChecker } = require("../Middlewares/CookieChecker")
const Router = express.Router()

Router.route("/login").post(login)
Router.route("/signup").post(signup)
Router.route("/main").post(cookieChecker,mainPage)
Router.route("/getUserData").post(cookieChecker,getUserData)
Router.route("/getAllUsersEmail").post(cookieChecker,getAllUsersEmail)


module.exports = Router