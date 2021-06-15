'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);

const offersRouter = new Router();
const api = getAPI();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
offersRouter.get(`/add`, (req, res) => {
  res.render(`new-ticket`);
});
offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: Array.isArray(body.category) ? body.category : [body.category],
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);

  res.render(`ticket-edit`, {offer, categories});
});
offersRouter.get(`/:id`, (req, res) => res.render(`my-tickets`));

module.exports = offersRouter;
