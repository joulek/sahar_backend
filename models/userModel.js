const BaseModel = require('../HUB/BaseModel');
const { outputConsole } = require("../utils/loggers");
const { executeQuery } = require("../config/database");
const { paginate } = require('../utils/pagination');

class UserModel extends BaseModel {
    constructor() {
        super('utilisateur');
    }
}
module.exports = UserModel;