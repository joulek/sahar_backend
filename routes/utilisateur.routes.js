const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/utilisateurController')
const controller = new Controller()
const router = require("express").Router();

const entityRouter = genericRoutes(controller, router)
router.post('/login', controller.login);
module.exports = entityRouter
