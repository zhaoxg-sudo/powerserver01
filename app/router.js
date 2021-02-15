'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/localall', controller.home.index);
  router.post('/tree/addnode', controller.home.treeaddnode);
  router.post('/tree/delnode', controller.home.treedelnode);
  app.io.route('client_message',app.io.controller.switch.ping);
};
