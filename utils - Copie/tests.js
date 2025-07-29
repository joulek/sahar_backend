const { outputConsole } = require("./loggers.js");

// const ValidateObject = async (obj) => {
//     try {
//         // Vérifier si l'objet est défini et non nul
//         if (obj !== undefined && obj !== null) {
//             // Vérifier si l'objet est un tableau non vide
//             if (Array.isArray(obj) && obj.length !== 0) {
//                 return true;
//             } else {
//                 return false;
//             }
//         } else {
//             return false;
//         }
//     } catch (error) {
//         await outputConsole("utils/tests/verif", error);
//         return false; // En cas d'erreur, retourner une valeur par défaut
//     }
// };


const ValidateObject = async (obj) => {
    let res = false;
    try {
        if (typeof obj !== "undefined" && typeof obj && obj !== null && obj.length != 0 ) {
            res = true;
        }
        return res;
    } catch (error) {
        console.log(await messageFailed("utils/tests/verif", error));
        return error;
    }
};


module.exports = { ValidateObject };







