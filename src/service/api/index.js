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

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  offer(app, new OfferService(mockData));
})();

module.exports = app;
