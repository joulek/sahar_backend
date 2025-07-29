const express = require("express");
const router = express.Router();
const magasinierController = require("../controllers/magasinierController");

const controller = new magasinierController();

// Route pour créer un magasinier
router.post("/ajouter", controller.createMagasinier);

// Route pour mettre à jour un magasinier
router.put("/update/:id", controller.updateMagasinier);

// Route pour supprimer un magasinier
router.delete("/delete/:id", controller.deleteMagasinier);

router.get("/all", controller.getAllMagasiniers);
module.exports = router;
