'use strict';

const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);
const category = require(`./category`);
const search = require(`./search`);
const offer = require(`./offer`);

const {
  CategoryService,
  SearchService,
  OfferService,
} = require(`../data-service`);

const getAppRoutes = () => {
  const app = new Router();

  const mockData = getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  offer(app, new OfferService(mockData));

  return app;
};

module.exports = getAppRoutes;
