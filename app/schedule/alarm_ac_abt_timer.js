const Subscription = require('egg').Subscription;
let alarmNum = 0
class AlarmAcDiscovery extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '2s', // 1s间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    alarmNum = alarmNum +1
    // 
    // 2,发送设备数据更新命令
    // 3,读取告警列表
    // 4,读取告警恢复列表
    console.log("AC_ab自动更新定时器，时间到。主动读取设备数据", alarmNum);
    this.ctx.service.powerac.getAcAbParams()
    if (alarmNum >1000)  {
      alarmNum = 0
      console.log("alarm AC_ab自动更新定时器，时间到。主动读取设备数据，并更新alarm table");
    }
  }
}

module.exports = AlarmAcDiscovery;
