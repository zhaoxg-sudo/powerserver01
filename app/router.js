'use strict';

/**
 * @param {Egg.Application} app - egg application V0.75 2021,07,05 zhaoxuegang released.
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
  router.get('/device/local/getsetparam/:catalogid', controller.devicelocal.devicelocalgetsetparam);
  router.get('/device/local/getsubmoduleid/:catalogid', controller.devicelocal.devicelocalgetsubmoduleid);
  router.get('/device/local/getalarmdata/:catalogid', controller.devicelocal.devicelocalgetalarmdata);
  router.get('/device/local/getpoweron/:catalogid', controller.devicelocal.devicelocalgetpoweron);
  router.get('/device/local/getpoweroff/:catalogid', controller.devicelocal.devicelocalgetpoweroff);
  router.post('/device/local/setpowerparam', controller.devicelocal.devicelocalsetpowerparam);
  app.io.route('client_message',app.io.controller.switch.ping);
};
