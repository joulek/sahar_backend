const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/operateurController');
const controller = new Controller();
const router = require("express").Router();

// Génère les routes génériques (GET, POST, PUT, DELETE, etc.)

// Ajoute tes routes personnalisées
router.post('/ajouter', controller.createOperateur);
router.get('/all', controller.getAll);
// Mise à jour opérateur
router.put("/update", controller.updateOperateur);
router.delete("/delete/:id", controller.deleteOperateur);
router.get("/by-user/:id", controller.getIdByUserId);

const entityRouter = genericRoutes(controller, router)
// 🔁 Corrigé : on exporte bien le router avec toutes les routes
module.exports = entityRouter;
