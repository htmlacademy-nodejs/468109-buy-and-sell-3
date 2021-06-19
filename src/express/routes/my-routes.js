'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();

  res.render(`my-tickets`, {offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers();

  res.render(`comments`, {offers: offers.slice(0, 3)});
});

module.exports = myRouter;
