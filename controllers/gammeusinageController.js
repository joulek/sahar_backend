const BaseController = require("../HUB/BaseController");
const gammeusinageModel = require("../models/gammeusinageModel");

module.exports = class machineController extends BaseController {
  constructor() {
    super(new gammeusinageModel());
  }

  // Récupérer toutes les gammes avec leur pièce associée
  getGamme = async (req, res) => {
    try {
      const gammes = await this.model.getAllGammes();
      return res.status(200).json(gammes);
    } catch (error) {
      console.error("❌ Erreur dans getGamme :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des gammes." });
    }
  };

  // Récupérer une gamme avec ses étapes techniques par ID
  getByIdGamme = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await this.model.getByIdGamme(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Erreur dans getByIdGamme :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération de la gamme." });
    }
  };
};
