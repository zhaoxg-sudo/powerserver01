'use strict';

/**
 * @param {Egg.Application} app - egg application V0.9 2022,11,23 zhaoxuegang released.
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/localall', controller.home.index);
  router.get('/childrenall', controller.home.childrenall);
  router.get('/user/userall', controller.user.userall);
  router.get('/user/:orgid', controller.user.userbyorgid);
  router.post('/user/login', controller.user.userlogin);
  router.post('/user/useradd', controller.user.useradd);
  router.post('/user/userdel', controller.user.userdel);
  router.post('/user/useredit', controller.user.useredit);
  router.get('/default/get/:catalogid', controller.default.defaultget);
  router.post('/default/update', controller.default.defaultupdate);
  router.get('/getallcurrentalarm', controller.alarm.getallcurrentalarm);
  router.get('/getallcurrentalarmtotol', controller.alarm.getallcurrentalarmtotol);
  router.post('/alarm/currentpage/:catalogid/:alarmtype', controller.alarm.postpagecurrentalarm);
  router.post('/alarm/current/update', controller.alarm.postcurrentalarmupdate);
  router.get('/alarm/current/:alarmid', controller.alarm.getcurrentalarm);
  router.post('/alarm/current/del', controller.alarm.postcurrentalarmdel);
  router.get('/getallhistoryalarmtotol', controller.alarm.getallhistoryalarmtotol);
  router.post('/alarm/historypage/:alarmtype', controller.alarm.postpagehistoryalarm);
  router.post('/alarm/history/add', controller.alarm.inserttohistoryalarm);
  router.post('/alarm/history/update', controller.alarm.posthistoryalarmupdate);
  router.post('/alarm/firedcheck', controller.alarm.postalarmfiredcheck);
  router.post('/alarm/firedinsert', controller.alarm.postalarmfiredinsert);
  router.get('/getallhistoryalarm', controller.alarm.getallhistoryalarm);
  router.get('/data/getalldatatotol', controller.data.getalldatatotol);
  router.post('/data/postdatapage', controller.data.postdatapage);
  router.post('/tree/addnode', controller.home.treeaddnode);
  router.post('/tree/delnode', controller.home.treedelnode);
  router.post('/topo/additem', controller.topo.topoadditem);
  router.post('/topo/delitem', controller.topo.topodelitem);
  router.get('/topo/getitem/:catalogid', controller.topo.topogetitem);
  router.get('/device/local/getrunstatus/:catalogid', controller.devicelocal.devicelocalgetrunstatus);
  router.get('/device/local/getsetparam/:catalogid', controller.devicelocal.devicelocalgetsetparam);
  router.get('/device/local/getsubmoduleid/:catalogid', controller.devicelocal.devicelocalgetsubmoduleid);
  router.get('/device/local/getalarmdata/:catalogid/:id', controller.devicelocal.devicelocalgetalarmdata);
  router.get('/device/local/getpoweron/:catalogid', controller.devicelocal.devicelocalgetpoweron);
  router.get('/device/local/getpoweroff/:catalogid', controller.devicelocal.devicelocalgetpoweroff);
  router.post('/device/local/setpowerparam', controller.devicelocal.devicelocalsetpowerparam);
  router.get('/device/local/getacparam/:catalogid', controller.deviceac.deviceacgetparam);
  router.get('/device/local/getacparamfromagent/:catalogid', controller.deviceac.getparamfromagentac);
  app.io.route('client_message',app.io.controller.switch.ping);
};
