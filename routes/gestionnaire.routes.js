const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/gestionnaireController');
const controller = new Controller();
const router = require("express").Router();

router.post('/ajouter', controller.createGestionnaire);
// Route pour mettre à jour un magasinier
router.put("/update/:id", controller.updateGestionnaire);

// Route pour supprimer un magasinier
router.delete("/delete/:id", controller.deleteGestionnaire);

const entityRouter = genericRoutes(controller, router)
// 🔁 Corrigé : on exporte bien le router avec toutes les routes
module.exports = entityRouter;
