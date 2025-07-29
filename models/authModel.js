const UserModel = require("./userModel");
const bcrypt = require("bcryptjs");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/authUtils");
class AuthentificationModel {
  constructor() { }

  login = async ({ req, res }) => {
    const { email, mot_de_passe } = req.body;
    const userModel = new UserModel();
    // Recherche de l'utilisateur par son email
    const user = await userModel.getBy({ key: "email", value: email });

    if (!user) {
      throw new Error("Invalid email");
    }
    const passwordMatch = await bcrypt.compare(
      mot_de_passe,
      user.mot_de_passe
    );
    if (!passwordMatch) {
      throw new Error("Invalid mot_de_passe");
    }
    // Création des jetons d'accès et de rafraîchissement
    // Création des jetons d'accès et de rafraîchissement
    const access_token = createAccessToken({ id: user.id });
    const refresh_token = createRefreshToken({ id: user.id });

    // Envoi des cookies pour le rafraîchissement du jeton
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // Validité de 30 jours
    });

    // Retourner la réponse
    res.json({
      msg: "Logged in successfully!",
      access_token,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      }
    });
  };
  register = async ({ req, res }) => {
    const { email, nom, prenom, mot_de_passe } = req.body;
    const userModel = new UserModel();

    // Vérifier si l'utilisateur existe déjà
    const [searchByEmail, searchByUsername] = await Promise.all([
      userModel.getBy({ key: "email", value: email }),
      userModel.getBy({ key: "nom", value: nom }),
      userModel.getBy({ key: "prenom", value: prenom }),
    ]);

    if (searchByEmail || searchByUsername) {
      throw new Error("User already exists!");
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 12);

    // Création de l'utilisateur
    const newUser = await userModel.create({
      email,
      nom,
      prenom,
      mot_de_passe: hashedPassword,
    });
    const createdUser = await userModel.getBy({
      key: "id",
      value: newUser.insertId,
    });

    // Création des jetons d'accès et de rafraîchissement
    const access_token = createAccessToken({ id: createdUser.id });
    const refresh_token = createRefreshToken({ id: createdUser.id });

    // Envoi des cookies pour le rafraîchissement du jeton
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      path: "/api/auth/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // Validité de 30 jours
    });

    // Retourner la réponse
    res.json({
      msg: "Registered Successfully!",
      access_token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        nom: createdUser.nom,
        prenom: createdUser.prenom,
      },
    });
  };
}

module.exports = AuthentificationModel;
