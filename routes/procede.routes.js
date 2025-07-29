const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/procedeController')
const controller = new Controller()
const router = require("express").Router();
router.get('/all', controller.getprocede); 
const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter
