// 📁 models/pieceFiniModel.js
const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");

module.exports = class piecefiniModel extends BaseModel {
  constructor() {
    super("piece_fini");
  }

  getAll = async () => {
    const query = `
      SELECT 
        pf.*, 
        c.nomComplet AS nom_client
      FROM piece_fini pf
      JOIN clients c ON pf.id_client = c.id
    `;
    return await executeQuery(query);
  };

  updateValidated = async (id, validated) => {
    try {
      const [piece] = await executeQuery(`SELECT * FROM piece_fini WHERE id = ?`, [id]);
      if (!piece) throw new Error("Pièce introuvable");

      const duree = piece.duree_totale_estimee || "00:00:00";

      // 🔄 Mettre à jour dans piece_fini
      await executeQuery(`UPDATE piece_fini SET validated = ? WHERE id = ?`, [validated, id]);

      const targetTable = validated === 1 ? "piece_valide" : "piece_non_valide";
      const tableOpposee = validated === 1 ? "piece_non_valide" : "piece_valide";

      // 🔥 Supprimer d'abord de la table opposée si elle y existe
      await executeQuery(`DELETE FROM ${tableOpposee} WHERE id_piece = ?`, [piece.id]);

      // ✅ Insérer dans la bonne table si non déjà présente
      const checkExistQuery = `SELECT 1 FROM ${targetTable} WHERE id_piece = ? LIMIT 1`;
      const exists = await executeQuery(checkExistQuery, [piece.id]);
      if (exists.length > 0) {
        console.log(`✅ Pièce déjà présente dans ${targetTable}`);
        return;
      }

      const insertQuery = `
      INSERT INTO ${targetTable}
      (id_piece, designation, dimensions, id_client, prioritaire, date_fin, duree_total_estimee, validated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
      await executeQuery(insertQuery, [
        piece.id,
        piece.designation,
        piece.dimensions,
        piece.id_client,
        piece.prioritaire,
        piece.date_fin,
        duree,
        validated,
      ]);

      console.log(`✅ Pièce insérée dans ${targetTable}`);
    } catch (err) {
      console.error("❌ Erreur updateValidated :", err.message);
      throw err;
    }
  };


  // 📊 Méthodes KPI et statistiques
  getTotalPieces = async (mois, annee = new Date().getFullYear()) => {
    console.log("📦 Mois et année pour getTotalPieces:", mois, annee);

    return await executeQuery(`
    SELECT COUNT(*) AS total_pieces 
    FROM piece_fini 
    WHERE MONTH(date_fin) = ? AND YEAR(date_fin) = ?`,
      [mois, annee]
    );
  };

  getNbPiecesValidees = async (mois, annee = new Date().getFullYear()) => {
    return await executeQuery(`
    SELECT COUNT(*) AS nb_pieces_validees 
    FROM piece_valide 
    WHERE MONTH(date_fin) = ? AND YEAR(date_fin) = ?
  `, [mois, annee]);
  };

  getNbPiecesNonValidees = async (mois, annee = new Date().getFullYear()) => {
    return await executeQuery(`
    SELECT COUNT(*) AS nb_pieces_non_validees 
    FROM piece_non_valide 
    WHERE MONTH(date_fin) = ? AND YEAR(date_fin) = ?
  `, [mois, annee]);
  };


  getValidatedStatsByDay = async (date) => {
    console.log("📅 Date ciblée :", date);

    return await executeQuery(`
    SELECT DATE(date_fin) AS jour,
           SUM(validated = 1) AS validees,
           SUM(validated = 0) AS non_validees
    FROM piece_fini
    WHERE DATE(date_fin) = ?
    GROUP BY DATE(date_fin)
    ORDER BY DATE(date_fin)
  `, [date]);
  };


  getPrioriteRepartition = async () => {
    return await executeQuery(`
      SELECT prioritaire, COUNT(*) AS total
      FROM piece
      GROUP BY prioritaire;
    `);
  };

  getPiecesTermineesDansLeTemps = async () => {
    return await executeQuery(`
      SELECT DATE(date_fin) AS date, COUNT(*) AS total_pieces_terminees
      FROM piece_fini
      GROUP BY DATE(date_fin)
      ORDER BY DATE(date_fin);
    `);
  };

  getNbPiecesParClient = async (mois, annee) => {
    return await executeQuery(
      `
    SELECT c.nomComplet AS client, COUNT(*) AS nb_pieces
    FROM piece_fini pf
    JOIN clients c ON pf.id_client = c.id
    WHERE MONTH(pf.date_fin) = ? AND YEAR(pf.date_fin) = ?
    GROUP BY c.nomComplet;
    `,
      [mois, annee]
    );
  };


  getDernieresPiecesFabriquees = async (limit = 5) => {
    return await executeQuery(`
      SELECT pf.designation, c.nomComplet AS client, pf.prioritaire, pf.date_fin,
             CASE WHEN pf.validated = 1 THEN 'Validée' ELSE 'Non validée' END AS statut
      FROM piece_fini pf
      JOIN clients c ON pf.id_client = c.id
      ORDER BY pf.date_fin DESC
      LIMIT ?;`, [limit]);
  };

  getSuiviTempsFabrication = async () => {
    return await executeQuery(`
      SELECT 
  pf.designation,
  pf.duree_totale_estimee,
  SEC_TO_TIME(SUM(TIME_TO_SEC(e.dure))) AS duree_reelle,
  SEC_TO_TIME(
    COALESCE(SUM(TIME_TO_SEC(e.dure)), 0) - TIME_TO_SEC(pf.duree_totale_estimee)
  ) AS ecart
FROM piece_fini pf
JOIN gamme_usinage g ON pf.id_piece = g.id_piece
JOIN etape_technique e ON e.id_gamme = g.id
GROUP BY pf.designation, pf.duree_totale_estimee;

    `);
  }

  tauxretour = async () => {
    return await executeQuery(`
     SELECT COUNT(*) AS total_finis, SUM(CASE WHEN validated = 0 THEN 1 ELSE 0 END) AS non_valides FROM piece_fini;
    `);
  };


  tauxParMois = async () => {
    return await executeQuery(`
    SELECT 
      DATE_FORMAT(date_fin, '%M %Y') AS mois,
      COUNT(*) AS total_finis,
      SUM(CASE WHEN validated = 0 THEN 1 ELSE 0 END) AS non_valides
    FROM piece_fini
    GROUP BY YEAR(date_fin), MONTH(date_fin)
    ORDER BY YEAR(date_fin), MONTH(date_fin);
  `);
  };



};
