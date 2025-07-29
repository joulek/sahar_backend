const express = require("express");
const router = express.Router();
const etapetechniqueController = new (require("../controllers/etapetechniqueController"))();

router.get("/all", etapetechniqueController.getEtape);
router.post("/ajouter", etapetechniqueController.createEtape);
router.put("/", etapetechniqueController.update);
router.delete("/:id", etapetechniqueController.delete);
router.get("/operateur/:id_operateur", etapetechniqueController.getEtapesByOperateur);
router.get("/gamme/:id_gamme", etapetechniqueController.getEtapesByGamme);
router.get("/last-by-profession/:id_utilisateur", etapetechniqueController.getEtapeDisponiblePourProfession);
router.put("/update-etat/:id", etapetechniqueController.updateEtatEtape);
router.post("/ajouter-estimation", etapetechniqueController.ajouterEstimationEtTerminer);
router.put("/update-etat/:id", etapetechniqueController.updateEtatEtape);
router.post("/etape/verifier-piece-fini/:id_etape", etapetechniqueController.verifierEtInsererPieceFini);
router.get("/repartitionpiece", etapetechniqueController.repartitionpiece);
module.exports = router;
