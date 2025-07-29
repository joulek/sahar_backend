const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/etapeOperateurController')
const controller = new Controller()
const router = require("express").Router();

const entityRouter = genericRoutes(controller, router)
router.get("/nombretotaletapeoperateur", controller.nombretotaletapeoperateur);
router.get("/nombretotalDureoperateur", controller.nombretotalDureoperateur);
module.exports = entityRouter
