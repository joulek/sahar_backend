const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/machineController')
const controller = new Controller()
const router = require("express").Router();
router.post("/save", controller.saveMachine);
const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter