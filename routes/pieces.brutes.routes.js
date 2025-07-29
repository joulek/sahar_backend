// routes.js
const genericRoutes = require('../HUB/genericRoutes');
const Controller = require("../controllers/piecesBrutesController");
const controller = new Controller(); // Correctement instancié
const router = require("express").Router();
// Route personnalisée
router.get('/materiau/:nom',controller.getByNomMateriau); // Appel de la méthode correctement
router.get('/all', controller.getAllWithDefaultNullReplaced); // Appel de la méthode correctement
// DELETE /pieceb/:id
router.delete("/:id", controller.delete);
const entityRouter = genericRoutes(controller, router)
module.exports = entityRouter;

