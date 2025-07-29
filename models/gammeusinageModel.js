const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");

module.exports = class gammeusinageModel extends BaseModel {
  constructor() {
    super("gamme_usinage");
  }

  async getAllGammes() {
    try {
      const query = `
       SELECT g.id, g.id_piece AS id_piece, g.label, p.designation AS designation_piece, p.cree_le, c.nomComplet AS client_nomComplet FROM gamme_usinage g JOIN piece p ON g.id_piece = p.id LEFT JOIN clients c ON p.id_client = c.id;
      `;
      const results = await executeQuery(query);
      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des gammes : ", error);
      throw error;
    }
  }

  async getByIdGamme(id_gamme) {
    try {
      // Récupérer les infos de la gamme
      const gammeQuery = `
        SELECT g.id, g.label, g.id_piece, p.designation AS designation_piece
        FROM gamme_usinage g
        JOIN piece p ON g.id_piece = p.id
        WHERE g.id = ?;
      `;
      const [gamme] = await executeQuery(gammeQuery, [id_gamme]);

      if (!gamme) {
        throw new Error("Gamme non trouvée");
      }

      // Récupérer les étapes associées à cette gamme
      const etapesQuery = `
        SELECT e.id, e.ordre, e.etat, e.dure,
               p.label AS nom_procede
        FROM etape_technique e
        JOIN procede p ON e.id_procede = p.id
        WHERE e.id_gamme = ?;
      `;
      const etapes = await executeQuery(etapesQuery, [id_gamme]);

      // Retourner un objet combiné
      return {
        ...gamme,
        etapes_techniques: etapes,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la gamme avec étapes : ",
        error
      );
      throw error;
    }
  }
};