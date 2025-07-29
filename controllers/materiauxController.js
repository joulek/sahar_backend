const BaseController = require("../HUB/BaseController");
const materiauxModel = require("../models/materiauxModel");

module.exports = class materiauxController extends BaseController{
    constructor(){
        super(new materiauxModel())
    }
}