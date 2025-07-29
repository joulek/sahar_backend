const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../Controllers/fournisseurController')
const controller = new Controller()
const router = require("express").Router();

const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter
