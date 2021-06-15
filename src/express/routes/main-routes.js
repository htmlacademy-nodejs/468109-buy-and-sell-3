'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();

  res.render(`main`, {offers});
});

module.exports = mainRouter;
