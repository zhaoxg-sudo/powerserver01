'use strict';

/**
 * @param {Egg.Application} app - egg application V0.72 2021,06,30 zhaoxuegang released.
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/localall', controller.home.index);
  router.post('/tree/addnode', controller.home.treeaddnode);
  router.post('/tree/delnode', controller.home.treedelnode);
  router.post('/topo/additem', controller.topo.topoadditem);
  router.get('/topo/getitem/:catalogid', controller.topo.topogetitem);
  router.get('/device/local/getrunstatus/:catalogid', controller.devicelocal.devicelocalgetrunstatus);
  app.io.route('client_message',app.io.controller.switch.ping);
};
