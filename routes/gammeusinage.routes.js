const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/gammeusinageController')
const controller = new Controller()
const router = require("express").Router();
router.get('/all', controller.getGamme); // Appel de la méthode correctement
router.get("/etape/:id", controller.getByIdGamme);
const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter
