const Subscription = require('egg').Subscription;
let alarmNum = 0
class AlarmAcDiscovery extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10s', // 1s间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    alarmNum = alarmNum +1
    let resultArr = [1,4,0,1,0,0x19,0x60,0];
    // this.ctx.service.powerac.sendMsg(resultArr,"192.168.1.171");
  //   this.ctx.service.powerac.sendMsgPromiseTimeout(0x04,resultArr,"192.168.1.171")
  //   .then((e)=>{
  //     console.log("AlarmAcDiscovery:promise resolve 处理结束-----------------",e);
  //     let receiveMsg = e.msg
  //     let code = 1   
  //     let data = {result:receiveMsg,code:code}
  //     let returnParam = data 
  //   })
  //  .catch((e)=>{
  //     console.log("AlarmAcDiscovery:promise reject 处理超时？？？？？？？？？",e);
  //     let receiveMsg = '设备应答超时，读取数据失败？？'
  //     let code = -1
  //     let data = {result:receiveMsg,code:code}
  //     let returnParam = data 
  //   })
    if (alarmNum >100 )  {
      alarmNum = 0
      console.log("alarm AC_ab自动更新定时器，时间到。主动读取设备数据，并更新alarm table");
    }
  }
}

module.exports = AlarmAcDiscovery;
