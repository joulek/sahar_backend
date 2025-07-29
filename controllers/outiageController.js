
const BaseController = require("../HUB/BaseController");
const outiageModel = require("../models/outiageModel");

module.exports = class outiageController extends BaseController{
    constructor(){
        super(new outiageModel())
    }
}