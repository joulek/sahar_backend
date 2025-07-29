const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/piecevalideController')
const controller = new Controller()
const router = require("express").Router();

router.get('/all', controller.getAll); // Appel de la méthode correctement


const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter
