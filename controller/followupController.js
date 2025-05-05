const myServices = require("../services/myServices");
const db = require("../config/database");

const followUpController = {
  create: async (req, res) => {
    const result = await myServices.create(db.models.follow_up, req.body);
    res.status(result.success ? 201 : 400).json(result);
  },

  getById: async (req, res) => {
    const result = await myServices.read(db.models.follow_up, req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  },

  updateById: async (req, res) => {
    const result = await myServices.update(db.models.follow_up, req.params.id, req.body);
    res.status(result.success ? 200 : 404).json(result);
  },

  deleteFollowups: async (req, res) => {
    const  { id } = req.params    
    const data = req.body
    const response = await myServices.update(db.models.follow_up, id, data);
    res.status(response.success ? 200 : 400).json(response);
  },

  list: async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const result = await myServices.list(db.models.follow_up, null, { is_delete: 0 }, limit, offset);
    res.status(200).json(result);
  },
};

module.exports = followUpController;
