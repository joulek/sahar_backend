// models/utilisateurModel.js
const BaseModel = require("../HUB/BaseModel");
const { executeQuery } = require("../config/database");

module.exports = class utilisateurModel extends BaseModel {
  constructor() {
    super("utilisateur");
  }
  createFromOperateur = async (operateurData) => {
    const { prenom, cin } = operateurData;

    try {
      const utilisateur = await this.create({
        prenom,
        cin,
        role: "technicien",
      });

      return utilisateur;
    } catch (err) {
      console.error("❌ Erreur création utilisateur :", err.message);
      throw err;
    }
  };
  createFromGestionnaire = async (operateurData) => {
    const { prenom, cin } = operateurData;


    try {
      const utilisateur = await this.create({
        prenom,
        cin,
        role: "gestionnaire",
      });

      return utilisateur;
    } catch (err) {
      console.error("❌ Erreur création utilisateur :", err.message);
      throw err;
    }
  };
  // Méthode statique pour le login : recherche un utilisateur par nom et cin
  static login = async (prenom, cin) => {
    try {
      // Requête SQL pour rechercher un utilisateur par nom et cin
      const result = await executeQuery(
        `SELECT * FROM utilisateur WHERE prenom = ? AND cin = ?`,
        [prenom, cin]
      );

      // Si l'utilisateur est trouvé, retourner les données de l'utilisateur
      if (result.length > 0) {
        return result[0];  // Retourne le premier utilisateur trouvé
      } else {
        throw new Error("Utilisateur non trouvé");
      }
    } catch (error) {
      throw new Error("Erreur lors de la tentative de connexion : " + error.message);
    }
  };
  updateFromOperateur = async (operateurData) => {
    const { prenom, cin } = operateurData;
  
  
    try {
      // 1. On récupère l'utilisateur lié par CIN
      const utilisateurs = await executeQuery(
        `SELECT * FROM utilisateur WHERE cin = ?`,
        [cin]
      );
  
      if (utilisateurs.length === 0) {
        throw new Error("Utilisateur lié introuvable pour CIN : " + cin);
      }
  
      const utilisateur = utilisateurs[0];
  
      // 2. Mise à jour du nom (et on doit passer un objet avec l'id inclus !)
      await this.update({
        id: utilisateur.id, // 🔥 il faut l'inclure ici
        prenom,
        cin
      });
  
  
      return { id: utilisateur.id, prenom };
    } catch (err) {
      console.error("❌ Erreur mise à jour utilisateur lié :", err.message);
      throw err;
    }
  };

  updateFromOperateurWithOldCin = async (operateur, oldCin) => {
  const updateQuery = `
    UPDATE utilisateur
    SET prenom = ?, cin = ?
    WHERE cin = ? AND role = 'technicien';
  `;

  const values = [operateur.prenom, operateur.cin, oldCin];

  const result = await executeQuery(updateQuery, values);

  if (result.affectedRows === 0) {
    throw new Error("Utilisateur lié introuvable pour CIN : " + oldCin);
  }

 

  return {
    id: operateur.id,
    prenom: operateur.prenom,
    cin: operateur.cin
  };
};

  
  
};
