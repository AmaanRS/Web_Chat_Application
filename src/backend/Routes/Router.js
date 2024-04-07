const { login,
    signup,
    mainPage,
    getUserData,
    getAllUsersEmail,
    addFriendBothWays,
    getUserConversation,
    sendMessage
} = require("../Controllers/Controller")
const express = require("express")
const { cookieChecker } = require("../Middlewares/CookieChecker")
const Router = express.Router()

Router.route("/login").post(login)
// This api endpoint is written in SocketServer
// Router.route("/logout").post(cookieChecker,logout)
Router.route("/signup").post(signup)
Router.route("/main").post(cookieChecker,mainPage)
Router.route("/getUserData").post(cookieChecker,getUserData)
Router.route("/getAllUsersEmail").post(cookieChecker,getAllUsersEmail)
Router.route("/addFriendBothWays").post(cookieChecker,addFriendBothWays)
Router.route("/getUserConversation").post(cookieChecker,getUserConversation)
Router.route("/sendMessage").post(cookieChecker,sendMessage)


module.exports = Router