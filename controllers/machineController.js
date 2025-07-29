const BaseController = require("../HUB/BaseController");
const machineModel = require("../models/machineModel");

module.exports = class machineController extends BaseController {
  constructor() {
    super(new machineModel());
    this.machineModel = new machineModel(); // pour accéder aux méthodes personnalisées
  }
saveMachine = async (req, res) => {
  try {
    const result = await this.machineModel.saveMachine(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.warn("⚠️ Erreur machine :", error.message);
    return res.status(400).json({ error: error.message });
  }
};


};
