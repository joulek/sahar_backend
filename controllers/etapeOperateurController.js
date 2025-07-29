const BaseController = require("../HUB/BaseController");
const etapeOperateurModel = require("../models/etapeOperateurModel");

module.exports = class etapeOperateurController extends BaseController {
    constructor() {
        super(new etapeOperateurModel())
    }
    nombretotaletapeoperateur = async (req, res) => {
        try {
            const { date } = req.query;

            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({ error: "❌ Date invalide" });
            }

            const result = await this.model.nombretotaletapeoperateur(date);
            res.json(result);
        } catch (err) {
            console.error("❌ Erreur comptage étapes opérateurs :", err);
            res.status(500).json({ error: "Erreur serveur" });
        }
    };

    // etapeOperateurController.js
    nombretotalDureoperateur = async (req, res) => {
        try {
            const { date } = req.query;  // ex. ?date=2025-06-18

            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({ error: "Date invalide (YYYY-MM-DD)" });
            }

            const result = await this.model.nombretotalDureoperateur(date);
            res.json(result);
        } catch (error) {
            console.error("❌ Erreur durée opérateurs :", error);
            res.status(500).json({ error: "Erreur suivi temps fabrication" });
        }
    };


}