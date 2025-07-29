const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");

module.exports = class pieceModel extends BaseModel {
  constructor() {
    super("piece");
  }

  async getAllPieces() {
    try {
      const query = `
        SELECT 
          p.id, 
          p.designation,
          p.id_client,
          p.id_materiaux,
          c.nomComplet AS client,
          m.label AS materiaux, 
          p.dimensions,
          CAST(p.prioritaire AS CHAR) AS prioritaire
        FROM piece p
        JOIN clients c ON p.id_client = c.id
        JOIN materiaux m ON p.id_materiaux = m.id
      `;
      const results = await executeQuery(query);
      console.log("Récupération des pièces :", results);
      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des pièces : ", error);
      throw error;
    }
  }

 

  async updatePrioritaire(id, prioritaire) {
    try {
      const query = `
        UPDATE piece 
        SET prioritaire = ? 
        WHERE id = ?
      `;
      const values = [prioritaire, id];
      const result = await executeQuery(query, values);
      console.log(`Priorité de la pièce ${id} mise à jour en ${prioritaire}`);
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la priorité :", error);
      throw error;
    }
  }
};