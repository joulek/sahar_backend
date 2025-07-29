const BaseController = require("../HUB/BaseController");
const UserModel = require('../models/userModel');


module.exports = class UserController extends BaseController {
  constructor() {
    super(new UserModel())
  }

}