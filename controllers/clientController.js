const BaseController = require("../HUB/BaseController");
const clientModel = require("../models/clientModel");

module.exports = class clientController extends BaseController{
    constructor(){
        super(new clientModel())
    }
}