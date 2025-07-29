const BaseController = require("../HUB/BaseController");
const magasinierModel = require("../models/magasinierModel");

module.exports = class magasinierController extends BaseController {
  constructor() {
    super(new magasinierModel());
  }
  getAllMagasiniers = async (req, res) => {
    try {
      const magasiniers = await this.model.getAllMagasiniers();
      return res.status(200).json(magasiniers);
    } catch (error) {
      console.error("❌ Erreur dans getAllMagasiniers :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des magasiniers." });
    }
  };
  // Créer un magasinier
  createMagasinier = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const response = await this.model.createMagasinier(data);

    return res.status(201).json({
      message: response.message,
      magasinierId: response.magasinierId,
      utilisateurId: response.utilisateurId,
    });
  } catch (error) {
    console.error("❌ Erreur dans createMagasinier :", error.message);

    // ✅ Si le message d'erreur est lié au CIN
    if (error.message.toLowerCase().includes("cin")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    // ✅ Sinon, message générique
    return res.status(500).json({
      error: "Erreur interne lors de la création du magasinier.",
    });
  }
};

// Mettre à jour un magasinier et son utilisateur associé
updateMagasinier = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const result = await this.model.updateMagasinier(id, data);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erreur dans updateMagasinier :", error.message);

    // ✅ Détail clair pour duplicata CIN
    if (error.message.toLowerCase().includes("cin")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Erreur lors de la mise à jour du magasinier et de l'utilisateur.",
    });
  }
};


  // Supprimer un magasinier et son utilisateur associé
  deleteMagasinier = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await this.model.deleteMagasinier(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Erreur dans deleteMagasinier :", error.message);
      return res.status(500).json({ error: "Erreur lors de la suppression du magasinier et de l'utilisateur." });
    }
  };
};
