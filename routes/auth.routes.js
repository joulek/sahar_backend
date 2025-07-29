


const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/authController');
const AuthController = require('../controllers/authController');
const controller = new Controller()
const router = require("express").Router();

const authController = new AuthController();


const entityRouter = genericRoutes(controller, router)
entityRouter.post("/register", authController.register);
entityRouter.post("/login", authController.login);
module.exports = entityRouter
