const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/pieceController')
const controller = new Controller()
const router = require("express").Router();

router.get('/all', controller.getPieces); // Appel de la méthode correctement
router.put("/priorite/:id", controller.updatePrioritaire);

const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter
