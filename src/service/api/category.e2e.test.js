'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {mockOffers} = require(`../constants/mocksData`);

const app = express();
app.use(express.json());
category(app, new DataService(mockOffers));

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "Журналы", "Игры", "Животные"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Словоблудие`, `Игры`, `Наркотики`])
      )
  );

});
