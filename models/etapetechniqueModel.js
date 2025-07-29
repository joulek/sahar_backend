const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");
module.exports = class etapetechniqueModel extends BaseModel {
  constructor() {
    super("etape_technique");
  }

  async createEtape(data) {
    try {
      const query = `INSERT INTO  etape_technique SET ?`;
      const result = await executeQuery(query, data);
      return { insertId: result.insertId };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.sqlMessage.includes("uniq_gamme_procede")) {
          throw new Error("🚫 Ce procédé est déjà utilisé pour cette gamme.");
        }
        if (error.sqlMessage.includes("uniq_gamme_ordre")) {
          throw new Error("🚫 Cet ordre est déjà utilisé pour cette gamme.");
        }
      }
      throw error;
    }
  }

  async getByOperateur(id_operateur) {
    try {
      const query = `
      SELECT 
  e.*, 
  g.label AS nom_gamme, 
  p.label AS nom_procede, 
  pi.designation AS nom_piece
FROM etape_technique e
JOIN gamme_usinage g ON e.id_gamme = g.id
JOIN procede p ON e.id_procede = p.id
JOIN piece pi ON g.id_piece = pi.id  -- 🔗 liaison pour récupérer la designation
WHERE e.etat = 'en_cours'
  AND EXISTS (
    SELECT 1
    FROM etape_operateur eo
    WHERE eo.id_etape = e.id AND eo.id_operateur = ?
  );

    `;
      const results = await executeQuery(query, [id_operateur]);
      return results;
    } catch (error) {
      console.error("Erreur dans getByOperateur :", error);
      throw error;
    }
  }



  async getAllEtapes() {
    try {
      const query = `
       SELECT e.id, e.ordre,e.dure, e.etat, g.label AS nom_gamme, p.label AS nom_procede, o.prenom AS prenom_operateur FROM etape_technique e JOIN gamme_usinage g ON e.id_gamme = g.id JOIN procede p ON e.id_procede = p.id JOIN operateur ;
      `;
      const results = await executeQuery(query);
      console.log(results); // Ajouter un log pour vérifier les résultats
      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des pièces : ", error);
      throw error;
    }
  } async getByGamme(id_gamme) {
    try {
      const query = `
        SELECT e.*, 
               g.label AS nom_gamme, 
               p.label AS nom_procede, 
        FROM etape_technique e 
        JOIN gamme_usinage g ON e.id_gamme = g.id 
        JOIN procede p ON e.id_procede = p.id 
        WHERE e.id_gamme = ?;
      `;
      const results = await executeQuery(query, [id_gamme]);

      // Loguer les résultats pour vérifier
      console.log("Résultats avant envoi : ", results);

      return results;
    } catch (error) {
      console.error("Erreur lors de la récupération des étapes par gamme : ", error);
      throw error;
    }
  }
  async getEtapeDisponiblePourProfession(id_utilisateur) {
    try {
      const query = `
      SELECT e.*, g.label AS nom_gamme, p.label AS nom_procede, pi.designation AS nom_piece FROM etape_technique e JOIN gamme_usinage g ON e.id_gamme = g.id JOIN procede p ON e.id_procede = p.id JOIN piece pi ON g.id_piece = pi.id WHERE e.id_procede = ( SELECT o.id_procede FROM operateur o WHERE o.id = ( SELECT id FROM operateur WHERE cin = ( SELECT cin FROM utilisateur WHERE id = ? ) ) ) AND e.etat = 'en_attente' AND NOT EXISTS ( SELECT 1 FROM etape_technique e2 WHERE e2.id_gamme = e.id_gamme AND e2.ordre < e.ordre AND e2.etat != 'fini' ) ORDER BY e.ordre ASC LIMIT 1;
    `;
      const results = await executeQuery(query, [id_utilisateur]);
      return results[0] || null;
    } catch (error) {
      console.error("Erreur dans getEtapeDisponiblePourProfession :", error);
      throw error;
    }
  }
  async ajouterEstimationEtTerminer(id_etape, id_operateur, duree_estimee) {
    try {
      // 🔁 Mise à jour uniquement SI la ligne existe déjà
      const updateDuree = `
      UPDATE etape_operateur
      SET duree_estimee = ?
      WHERE id_etape = ? AND id_operateur = ?
    `;
      const result = await executeQuery(updateDuree, [duree_estimee, id_etape, id_operateur]);

      // ✅ Si aucun update (0 ligne affectée), on INSÈRE
      if (result.affectedRows === 0) {
        const insertQuery = `
        INSERT INTO etape_operateur (id_etape, id_operateur, duree_estimee)
        VALUES (?, ?, ?)
      `;
        await executeQuery(insertQuery, [id_etape, id_operateur, duree_estimee]);
      }

      // 🛠️ Mettre à jour l’état
      const updateEtat = `
      UPDATE etape_technique
      SET etat = 'fini'
      WHERE id = ?
    `;
      await executeQuery(updateEtat, [id_etape]);
      await this.verifierEtInsererPieceFini(id_etape);

      return { success: true, message: "Estimation ajoutée et étape terminée." };
    } catch (error) {
      console.error("❌ Erreur dans ajouterEstimationEtTerminer :", error);
      throw error;
    }
  }

  async updateEtat(id_etape, newEtat) {
    try {
      const query = `
      UPDATE etape_technique
      SET etat = ?
      WHERE id = ?;
    `;
      const result = await executeQuery(query, [newEtat, id_etape]);

      // si état = 'en_cours' → enregistrer aussi dans etape_operateur
      if (newEtat === "en_cours") {
        // récupère opérateur depuis étape
        const getOperateurQuery = `
        SELECT o.id AS id_operateur
        FROM operateur o
        JOIN utilisateur u ON o.cin = u.cin
        WHERE u.id = (
          SELECT u.id
          FROM utilisateur u
          JOIN operateur o ON u.cin = o.cin
          JOIN etape_technique e ON o.id_procede = e.id_procede
          WHERE e.id = ?
          LIMIT 1
        );
      `;

        const resultOp = await executeQuery(getOperateurQuery, [id_etape]);
        const id_operateur = resultOp?.[0]?.id_operateur;

        if (id_operateur) {
          const insertQuery = `
          INSERT INTO etape_operateur (id_etape, id_operateur)
          VALUES (?, ?);
        `;
          await executeQuery(insertQuery, [id_etape, id_operateur]);
        }
      }

      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état :", error);
      throw error;
    }
  }

  async verifierEtInsererPieceFini(id_etape) {
    try {
      // Étape 1 : récupérer id_gamme depuis l'étape
      const [etape] = await executeQuery(`SELECT id_gamme FROM etape_technique WHERE id = ?`, [id_etape]);
      if (!etape) return;

      const id_gamme = etape.id_gamme;

      // Étape 2 : vérifier s’il reste des étapes non finies
      const [restantes] = await executeQuery(`
      SELECT COUNT(*) AS nb_restantes
      FROM etape_technique
      WHERE id_gamme = ? AND etat != 'fini'
    `, [id_gamme]);
      if (restantes.nb_restantes > 0) return; // Il reste encore des étapes

      // Étape 3 : récupérer la pièce liée
      const [piece] = await executeQuery(`
      SELECT p.*
      FROM gamme_usinage g
      JOIN piece p ON g.id_piece = p.id
      WHERE g.id = ?
    `, [id_gamme]);
      if (!piece) return;

      const id_piece = piece.id;

      // Étape 4 : calculer durée totale estimée
      const [dur] = await executeQuery(`
      SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(duree_estimee))) AS duree_totale
      FROM etape_operateur eo
      JOIN etape_technique et ON eo.id_etape = et.id
      WHERE et.id_gamme = ?
    `, [id_gamme]);
      const duree_totale = dur.duree_totale;

      // Étape 5 : vérifier si déjà insérée dans piece_fini
      const dejaInseree = await executeQuery(`SELECT 1 FROM piece_fini WHERE id_piece = ? LIMIT 1`, [id_piece]);
      if (dejaInseree.length > 0) return;

      // Étape 6 : insérer dans piece_fini
      await executeQuery(`
      INSERT INTO piece_fini (id_piece, designation, dimensions, id_client, prioritaire, date_fin, validated, duree_totale_estimee)
      VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
    `, [
        id_piece,
        piece.designation,
        piece.dimensions,
        piece.id_client,
        piece.prioritaire,
        piece.validated ?? null,
        duree_totale
      ]);

    } catch (error) {
      console.error("❌ Erreur dans verifierEtInsererPieceFini :", error);
      throw error;
    }
  }
  repartitionpiece = async () => {
    return await executeQuery(`
      SELECT
  SUM(CASE 
        WHEN finished_etapes = total_etapes THEN 1 
        ELSE 0 
      END) AS finies,
  SUM(CASE 
        WHEN finished_etapes < total_etapes 
             AND has_encours = 1 THEN 1 
        ELSE 0 
      END) AS en_cours,
  SUM(CASE 
        WHEN finished_etapes = 0 
             AND has_encours = 0 THEN 1 
        ELSE 0 
      END) AS en_attente
FROM (
  SELECT 
    et.id_gamme,
    COUNT(*) AS total_etapes,
    SUM(CASE WHEN et.etat = 'fini' THEN 1 ELSE 0 END) AS finished_etapes,
    MAX(CASE WHEN et.etat = 'en_cours' THEN 1 ELSE 0 END) AS has_encours
  FROM etape_technique et
  GROUP BY et.id_gamme
) AS piece_etat;

    `);
  }


};
