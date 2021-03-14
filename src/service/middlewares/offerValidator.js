'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (req, res, next) => {
  const {offer} = res.locals;
  const newOffer = offer ? Object.assign(offer, req.body) : req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(StatusCodes.BAD_REQUEST)
      .send(ReasonPhrases.BAD_REQUEST);
  }

  next();
};
