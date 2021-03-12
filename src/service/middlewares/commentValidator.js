'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

const offerKeys = [`text`];

module.exports = (req, res, next) => {
  const {comment} = res.locals;
  const newComment = comment ? Object.assign(comment, req.body) : req.body;
  const keys = Object.keys(newComment);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(StatusCodes.BAD_REQUEST)
      .send(ReasonPhrases.BAD_REQUEST);
  }

  next();
};
