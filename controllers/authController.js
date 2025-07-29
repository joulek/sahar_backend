const BaseController = require("../HUB/BaseController");
const AuthModel = require("../models/authModel");
const { trycatch } = require("../utils/error-handler");

module.exports = class AuthController extends BaseController{
    constructor(){
        super(new AuthModel())
    }

    register = async (req, res) => {
      trycatch(this.model.register, {req,res}, res)
    }
  
    login=async(req, res) =>{
      trycatch(this.model.login, {req,res}, res)
    }
}