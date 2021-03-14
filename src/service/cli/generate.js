'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const {
  MAX_ID_LENGTH
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `src/data/sentences.txt`;
const FILE_TITLES_PATH = `src/data/titles.txt`;
const FILE_CATEGORIES_PATH = `src/data/categories.txt`;
const FILE_COMMENTS_PATH = `src/data/comments.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const MAX_COUNT = 1000;

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const MAX_COMMENTS = 4;

const getPictureItemNumber = (number) => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};

const getPictureFileName = (number) => {
  return `item${getPictureItemNumber(number)}.jpg`;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generateOffers = (count, titles, categories, sentences, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }));
};

const runGenerateData = async (args) => {
  const [sentences, titles, categories, comments] = await Promise.all([
    readContent(FILE_SENTENCES_PATH),
    readContent(FILE_TITLES_PATH),
    readContent(FILE_CATEGORIES_PATH),
    readContent(FILE_COMMENTS_PATH)
  ]);

  const [count] = args;
  const countData = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (countData > MAX_COUNT) {
    return console.error(chalk.red(`Не больше 1000 объявлений`));
  }

  const content = JSON.stringify(generateOffers(countData, titles, categories, sentences, comments));

  try {
    await fs.writeFile(FILE_NAME, content);
    console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    console.error(chalk.red(`Can't write data to file...`));
  }

  return null;
};

module.exports = {
  name: `--generate`,
  run(args) {
    runGenerateData(args);
  }
};
