const { login,signup,mainPage } = require("../Controllers/Controller")
const express = require("express")
const { cookieChecker } = require("../Middlewares/CookieChecker")
const Router = express.Router()

Router.route("/login").post(login)
Router.route("/signup").post(signup)
Router.route("/main").post(cookieChecker,mainPage)

module.exports = Router