'use strict';

const {nanoid} = require(`nanoid`);

const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

    this._offers = this._offers.concat(newOffer);

    return newOffer;
  }

  drop(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);

    return offer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer, offer);
  }

  findAllComments(offer) {
    return offer.comments;
  }

  findOneComment(offer, commentId) {
    return offer.comments.find((item) => item.id === commentId);
  }

  createComment(offer, comment) {
    const createdComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    const newComments = offer.comments.concat(createdComment);

    this.update(offer.id, {comments: newComments});

    return createdComment;
  }

  dropComment(offer, commentId) {
    const droppedComment = this.findOneComment(offer, commentId);

    const newComments = offer.comments.filter((item) => item.id !== commentId);

    this.update(offer.id, {comments: newComments});

    return droppedComment;
  }
}

module.exports = OfferService;
