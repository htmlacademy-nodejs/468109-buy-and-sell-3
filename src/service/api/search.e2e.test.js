'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);

const mockData = [
  {
    id: `UQtEAB`,
    title: `Куплю торт`,
    picture: `item13.jpg`,
    description: `Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Таких предложений больше нет! Бонусом отдам все аксессуары.`,
    type: `OFFER`,
    sum: 2619,
    category: [
      `Словоблудие`
    ],
    comments: [
      {
        id: `Usvy8J`,
        text: `С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `vzO9gL`,
        text: `А сколько игр в комплекте? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    id: `ZZCcei`,
    title: `Куплю антиквариат`,
    picture: `item07.jpg`,
    description: `Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Пикачу способен высвобождать электрическую энергию Это настоящая находка для коллекционера!`,
    type: `OFFER`,
    sum: 52326,
    category: [
      `Игры`
    ],
    comments: [
      {
        id: `ZxU62o`,
        text: `Продаю в связи с переездом. Отрываю от сердца. А где блок питания? Оплата наличными или перевод на карту?`
      },
      {
        id: `rw6p8C`,
        text: `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте?`
      }
    ]
  },
  {
    id: `Pdeh--`,
    title: `Продам новую приставку Sony Playstation 5`,
    picture: `item07.jpg`,
    description: `Этот покемон достаточно своевольный Товар в отличном состоянии. Если использовать на Пикачу Камень Молнии, то он превратится в Райчу Пользовались бережно и только по большим праздникам.`,
    type: `SALE`,
    sum: 14733,
    category: [
      `Наркотики`
    ],
    comments: [
      {
        id: `sz1GGb`,
        text: `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`
      },
      {
        id: `z4p879`,
        text: `Неплохо, но дорого. Совсем немного...`
      }
    ]
  },
  {
    id: `Q0PlwA`,
    title: `Куплю торт`,
    picture: `item11.jpg`,
    description: `Таких предложений больше нет! Если товар не понравится — верну всё до последней копейки. Бонусом отдам все аксессуары. При покупке с меня бесплатная доставка в черте города.`,
    type: `SALE`,
    sum: 4978,
    category: [
      `Словоблудие`
    ],
    comments: [
      {
        id: `7QzIJ0`,
        text: `А сколько игр в комплекте?`
      },
      {
        id: `Sc2ace`,
        text: `Вы что?! В магазине дешевле. `
      },
      {
        id: `hQtksw`,
        text: `Совсем немного...`
      },
      {
        id: `t2wV7y`,
        text: `Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    id: `pG37PI`,
    title: `Продам отличную подборку фильмов на VHS`,
    picture: `item03.jpg`,
    description: `Если товар не понравится — верну всё до последней копейки. Продаю с болью в сердце... Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
    type: `SALE`,
    sum: 99908,
    category: [
      `Игры`
    ],
    comments: [
      {
        id: `_BThzF`,
        text: `Совсем немного...`
      },
      {
        id: `wRTM5L`,
        text: `А сколько игр в комплекте?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам новую приставку`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`Pdeh--`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(StatusCodes.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(StatusCodes.BAD_REQUEST)
);
