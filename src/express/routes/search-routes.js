'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const searchRouter = new Router();
const api = getAPI();

searchRouter.get(`/`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search-result`, {
      results
    });
  } catch (error) {
    res.render(`search-result`, {
      results: []
    });
  }
});

module.exports = searchRouter;
