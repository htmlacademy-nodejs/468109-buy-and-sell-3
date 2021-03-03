'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offerValidator`);
const commentValidator = require(`../middlewares/commentValidator`);
const offerExist = require(`../middlewares/offerExist`);
const commentExist = require(`../middlewares/commentExists`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(HttpCode.OK)
      .json(offers);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.get(`/:offerId`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.put(`/:offerId`, [offerExist(service), offerValidator], (req, res) => {
    const {offerId} = req.params;

    const newOffer = service.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(newOffer);
  });

  route.delete(`/:offerId`, offerExist(service), (req, res) => {
    const {offerId} = req.params;

    const deletedOffer = service.drop(offerId);

    return res.status(HttpCode.OK)
      .json(deletedOffer);
  });

  route.get(`/:offerId/comments`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    const comments = service.findAllComments(offer);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:offerId/comments/`, [offerExist(service), commentValidator], (req, res) => {
    const {offer} = res.locals;

    const newComment = service.createComment(offer, req.body);

    return res.status(HttpCode.OK)
      .json(newComment);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(service), commentExist(service), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;

    const deletedComment = service.dropComment(offer, commentId);

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
