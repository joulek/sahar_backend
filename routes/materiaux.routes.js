const genericRoutes = require('../HUB/genericRoutes');
const Controller = require('../controllers/materiauxController')
const controller = new Controller()
const router = require("express").Router();

const entityRouter = genericRoutes(controller, router)

module.exports = entityRouter
