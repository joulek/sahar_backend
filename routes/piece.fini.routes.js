// 📁 routes/piecefiniRoutes.js
const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/piecefiniController');
const controller = new Controller();
const router = require("express").Router();

// Routes personnalisées KPI
router.get("/total", controller.getTotalPieces);
router.get("/validees", controller.getNbPiecesValidees);
router.get("/non-validees", controller.getNbPiecesNonValidees);
router.get("/validated-stats", controller.getValidatedStatsByDay);
router.get("/priorites", controller.getPrioriteRepartition);
router.get("/progression", controller.getPiecesTermineesDansLeTemps);
router.get("/par-client", controller.getNbPiecesParClient);
router.get("/dernieres", controller.getDernieresPiecesFabriquees);
router.get("/suivi-temps", controller.getSuiviTempsFabrication);

// Routes génériques
router.get("/", controller.getAllPieces);
router.put("/:id", controller.updateValidated);
router.get("/taux-retour", controller.tauxretour); 
router.get("/tauxparmois", controller.tauxParMois);



//route mouch kif kif hez lil c
const entityRouter = genericRoutes(controller, router);
module.exports = entityRouter;
