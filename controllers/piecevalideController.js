const BaseController = require("../HUB/BaseController"); // ✅ IMPORT CORRECT
const piecevalidemodel = require("../models/piecevalidemodel");

module.exports = class piecevalideController extends BaseController {
  constructor() {
    super(new piecevalidemodel());
  }

  getAll = async (req, res) => {
    try {
      const piecesWithDetails = await this.model.getAll();
      return res.status(200).json(piecesWithDetails);
    } catch (error) {
      console.error("❌ Erreur dans getPieces :", error.message);
      return res.status(500).json({ error: "Erreur lors de la récupération des pièces." });
    }
  };

};
