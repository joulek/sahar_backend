// piecesBrutesModel.js
const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database"); // ✅ Importation correcte

module.exports = class piecesbrutesModel extends BaseModel {
  constructor() {
    super("pieces_brutes");
  }

  // ✅ Méthode pour récupérer par nom de matériaux
  async getByNomMateriau(nom) {
    const query = `
      SELECT pb.* 
      FROM pieces_brutes pb 
      JOIN materiaux m ON pb.idmateriaux = m.id 
      WHERE m.label = ?
    `;
    try {
      const results = await executeQuery(query, [nom]); // ✅ Appel correct à executeQuery
      return results;
    } catch (error) {
      console.error("❌ Erreur dans getByNomMateriau :", error.message);
      throw new Error("Erreur lors de la récupération des pièces brutes.");
    }
  }

  // ✅ Nouvelle méthode pour récupérer toutes les pièces brutes avec remplacement des NULL
  async getAllWithDefaultNullReplaced() {
    const query = `
      SELECT 
    pb.id,
    pb.idmateriaux,
    IFNULL(m.label, 'Non renseigné') AS label_materiaux,
    IFNULL(pb.quantite, 'Non renseigné') AS quantite,
    IFNULL(pb.forme, 'Non renseigné') AS forme,
    IFNULL(pb.longueur, 'Non renseigné') AS longueur,
    IFNULL(pb.largeur, 'Non renseigné') AS largeur,
    IFNULL(pb.epaisseur, 'Non renseigné') AS epaisseur,
    IFNULL(pb.diametre_interieur, 'Non renseigné') AS diametre_interieur,
    IFNULL(pb.diametre_exterieur, 'Non renseigné') AS diametre_exterieur,
    IFNULL(pb.traitement_surface, 'Non renseigné') AS traitement_surface,
    IFNULL(pb.emplacement, 'Non renseigné') AS emplacement
FROM pieces_brutes pb
LEFT JOIN materiaux m ON pb.idmateriaux = m.id;


    `;
    try {
      const results = await executeQuery(query); // Appel à executeQuery sans paramètres
      return results;
    } catch (error) {
      console.error("❌ Erreur dans getAllWithDefaultNullReplaced :", error.message);
      throw new Error("Erreur lors de la récupération des pièces brutes avec remplacement des NULL.");
    }
  }
  // ✅ Suppression d'une pièce brute
  async delete(id) {
    try {
      const sql = "DELETE FROM pieces_brutes WHERE id = ?";
      await db.query(sql, [id]);
    } catch (error) {
      throw new Error("Erreur lors de la suppression de la pièce brute.");
    }
  };

  async decrementOrDelete(id) {
    try {
      const result = await executeQuery("SELECT quantite FROM pieces_brutes WHERE id = ?", [id]);

      if (!result || result.length === 0) {
        throw new Error("❌ Pièce brute introuvable avec cet ID.");
      }

      const quantite = result[0].quantite;

      if (quantite > 1) {
        await executeQuery("UPDATE pieces_brutes SET quantite = quantite - 1 WHERE id = ?", [id]);
      } else {
        await executeQuery("DELETE FROM pieces_brutes WHERE id = ?", [id]);
      }

    } catch (err) {
      console.error("🔴 Erreur SQL decrementOrDelete :", err);
      throw new Error("Erreur decrement/suppression pièce brute.");
    }
  }



};
