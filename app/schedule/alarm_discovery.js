const Subscription = require('egg').Subscription;
let alarmNum = 0
class AlarmDiscovery extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '2s', // 10s间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    alarmNum = alarmNum +1
    if (alarmNum >10000 )  alarmNum = 0
    console.log("alarm自动更新定时器，时间到。通过websocket 发送alarm msg");
     //1,从服务获取表
    let table = await  this.ctx.service.power.getAlarmTable();
    console.log('定时读取的alarm表', table)
    // if (table.lenght > 0) {
    let ii;
    let length = table.length;
    for ( ii=0;ii < length;ii++) {
      console.log("---读取alarm状态：",table[ii]); 
      this.ctx.app.io.emit("alarm","电源发生报警,消息为："+ table[ii].msg.toString())
    }
  }
}

module.exports = AlarmDiscovery;
