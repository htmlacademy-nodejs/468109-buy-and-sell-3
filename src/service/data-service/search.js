'use strict';

const {checkTextMatch} = require(`../../utils`);

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(search) {
    return this._offers.filter((item) => checkTextMatch(search, item.title));
  }
}

module.exports = SearchService;
