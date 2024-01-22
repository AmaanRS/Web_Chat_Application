const { login,signup } = require("../Controllers/Controller")
const express = require("express")
const Router = express.Router()

Router.route("/login").post(login)
Router.route("/signup").post(signup)

module.exports = Router