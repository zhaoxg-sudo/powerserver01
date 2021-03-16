// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome = require('../../../app/controller/home');
import ExportTopo = require('../../../app/controller/topo');

declare module 'egg' {
  interface IController {
    home: ExportHome;
    topo: ExportTopo;
  }
}
