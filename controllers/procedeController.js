const BaseController = require("../HUB/BaseController");
const procedeModel = require("../models/procedeModel");

module.exports = class procedeController extends BaseController{
    constructor(){
        super(new procedeModel())
    }
    getprocede = async (req, res) => {
        try {
          const etapes = await this.model.getAllprocede();
          return res.status(200).json(etapes);
        } catch (error) {
          console.error("❌ Erreur dans getAllprocedes :", error.message);
          return res.status(500).json({ error: "Erreur lors de la récupération des procedes." });
        }
      };
}