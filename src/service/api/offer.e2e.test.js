'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const {mockOffers} = require(`../constants/mocksData`);

const createAPI = () => {
  const app = express();

  const cloneData = JSON.parse(JSON.stringify(mockOffers));

  app.use(express.json());
  offer(app, new DataService(cloneData));
  return app;
};

describe(`API returns a list of all offers`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer's id equals "UQtEAB"`, () => expect(response.body[0].id).toBe(`UQtEAB`));
});

describe(`API returns an offer with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/pG37PI`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Offer's title is "Продам отличную подборку фильмов на VHS"`, () => expect(response.body.title).toBe(`Продам отличную подборку фильмов на VHS`));

});

describe(`API creates an offer if data is valid`, () => {

  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайфы`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));

  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {

  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(StatusCodes.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {

  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/ZZCcei`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offer is really changed`, () => request(app)
    .get(`/offers/ZZCcei`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {

  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {

  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/Q0PlwA`)
    .send(invalidOffer)
    .expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/pG37PI`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`pG37PI`));

  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => {
      return expect(res.body.length).toBe(4);
    })
  );

});

test(`API refuses to delete non-existent offer`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/offers/UQtEAB/comments/NOEXST`)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/offers/UQtEAB/comments`)
    .send({})
    .expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/UQtEAB/comments/Usvy8J`);
  });

  test(`Status code 200`, () => {
    // console.log('response', response);

    return expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test(`Comments count is 1 now`, () => request(app)
    .get(`/offers/UQtEAB/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent comment`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/offers/UQtEAB/comments/NOEXST`)
    .expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/offers/NOEXST/comments/UQtEAB`)
    .expect(StatusCodes.NOT_FOUND);
});
