const { trycatch } = require("../utils/error-handler");
const model = require('./BaseModel');

module.exports = class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll = async (req, res) => {
        trycatch(await this.model.getAll, undefined, res);
    }
    paginate = async (req, res) => {
        trycatch(await this.model.paginate, req.body, res);
    };
    create = async (req, res) => {
        trycatch(await this.model.create, req.body, res)
    }
    update = async (req, res) => {
        trycatch(await this.model.update, req.body, res)
    }
    delete = async (req, res) => {
        trycatch(await this.model.delete, req.params.id, res)
    }
    getBy = async (req, res) => {
        trycatch(await this.model.getBy, { key: req.params.key, value: req.params.value })
    }

}