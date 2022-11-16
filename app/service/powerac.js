const Service = require('egg').Service;
const { Pool, Client } = require('pg')
const dgram = require('dgram')
const server = dgram.createSocket('udp4');
let promisePool = [];
let token = 0x04
let session = 0;
let _this = this;
let alarmFiredFlag = false;
let alarmTable = [];
let sTable = [];
// 绑定本机的ip地址
server.bind(7400, '0.0.0.0');
// 开启socket 监听服务
server.on("message", function (msg, rinfo) {
  let startRecDataFlag = 1
  let rcmsg = msg;
  let ipinfo = rinfo;
  // console.log('port=7400已接收到设备端发送的数据：' + msg.toString('hex'));
  console.log("port=7400设备端地址信息为：", rinfo);
  let commType = parseInt(msg.toString('hex').slice(2, 4), 16);
  //接收到消息处理
  if (startRecDataFlag) {
    switch (commType) {
      case 0x04:
        console.log('port=7400已接收到设备端发送的应答数据：' + msg.toString('hex'));
        // msg process
        let returnmsg = {}
        let auv = rcmsg.toString('hex').slice(6, 10);
        // auv = '00aa'
        returnmsg.auv = auv
        let buv = rcmsg.toString('hex').slice(10, 14);
        // buv = '00aa'
        returnmsg.buv = buv
        let cuv = rcmsg.toString('hex').slice(14, 18);
        // cuv = '00aa'
        returnmsg.cuv = cuv
        let aov = rcmsg.toString('hex').slice(18, 22);
        // aov = '00aa'
        returnmsg.aov = aov
        let bov = rcmsg.toString('hex').slice(22, 26);
        // bov = '00aa'
        returnmsg.bov = bov
        let cov = rcmsg.toString('hex').slice(26, 30);
        // cov = '00aa'
        returnmsg.cov = cov
        let aoa = rcmsg.toString('hex').slice(30, 34);
        // aoa = '00aa'
        returnmsg.aoa = aoa
        let boa = rcmsg.toString('hex').slice(34, 38);
        // boa = '00aa'
        returnmsg.boa = boa
        let coa = rcmsg.toString('hex').slice(38, 42);
        // coa = '00aa'
        returnmsg.coa = coa
        let afu = rcmsg.toString('hex').slice(42, 46);
        // afu = '00aa'
        returnmsg.afu = afu
        let bfu = rcmsg.toString('hex').slice(46, 50);
        // bfu = '00aa'
        returnmsg.bfu = bfu
        let cfu = rcmsg.toString('hex').slice(50, 54);
        // cfu = '00aa'
        returnmsg.cfu = cfu
        let abcv = rcmsg.toString('hex').slice(54, 58);
        returnmsg.abcv = abcv
        let av = rcmsg.toString('hex').slice(58, 62);
        returnmsg.av = av
        let bv = rcmsg.toString('hex').slice(62, 66);
        returnmsg.bv = bv
        let cv = rcmsg.toString('hex').slice(66, 70);
        returnmsg.cv = cv
        let abca = rcmsg.toString('hex').slice(70, 74);
        returnmsg.abca = abca
        let aa = rcmsg.toString('hex').slice(74, 78);
        returnmsg.aa = aa
        let ba = rcmsg.toString('hex').slice(78, 82);
        returnmsg.ba = ba
        let ca = rcmsg.toString('hex').slice(82, 86);
        returnmsg.ca = ca
        let mainstatus = rcmsg.toString('hex').slice(86, 90);
        returnmsg.mainstatus = mainstatus
        let stabilestatus= rcmsg.toString('hex').slice(90, 94);
        returnmsg.stabilestatus = stabilestatus
        let stepstatus = rcmsg.toString('hex').slice(94, 98);
        returnmsg.stepstatus = stepstatus
        let syncstatus = rcmsg.toString('hex').slice(98, 102);
        returnmsg.syncstatus = syncstatus
        let autostatus = rcmsg.toString('hex').slice(102, 106);
        returnmsg.autostatus = autostatus
        let date = new Date()
        let year = date.getFullYear() 
        let month =  date.getMonth()+1 
        let day = date.getDate()
        let hour =  date.getHours() 
        let minute = date.getMinutes()
        let second = date.getSeconds()
        let time = year + '-' + String(month >9?month:("0"+month)) + '-' + String(day >9?day:("0"+day)) + ' ' +  String(hour >9?hour:("0"+hour)) + ':' + String(minute >9?minute:("0"+minute)) + ':' + String(second >9?second:("0"+second)) 
        returnmsg.time = time
        msg = JSON.stringify(returnmsg)
        let res = {
          token: token,
          msg: msg
        }
        let key = 0x04;
        let req = promisePool[key]
        if (req) {
          req.resolve(res);
          clearTimeout(req.timer);
          console.log("=========0x04收到正确应答消息========，token=", token);
          delete promisePool[token];
        } else {
          console.log("=========0x04消息过期或不明消息========", token);
          }
      break;
      default:
    }
  }
})
server.on("listening", function () {
    let address = server.address();
    console.log("AC_AB socket服务器开始监听。地址信息为", address);
});
// power ac service
class PoweracService extends Service {
  //get session ID
  async getSessionID() {
    if (session > 65535)
      session = 0;
      session = session + 1;
      return session;
  }
  //读取告警信息并存入alarmTable
  async getAcAbAlarm(token, msg, powerip) {
    let returnParam
    await sendMsgPromiseTimeout(token, msg, powerip)
            .then((e)=>{
                console.log("getAcAbParam:promise resolve 处理结束-----------------",e);
                let receiveMsg = e.msg
                let code = 1   
                data = {result:receiveMsg,code:code}
                returnParam = data 
                return returnParam;
            })
            .catch((e)=>{
                console.log("getAcAbParam:promise reject 处理超时？？？？？？？？？",e);
                let receiveMsg = '设备应答超时，读取数据失败？？'
                let code = -1
                data = {result:receiveMsg,code:code}
                returnParam = data 
                return returnParam;
            })
  } 
    //从当前更新表
    async getAlarmTable() {
        let i
        let numbersCopy = [];
        for (i = 0; i < sTable.length; i++) {
            numbersCopy[i] = sTable[i];
        }
        // console.log("getAlarmTable获取alarm表", numbersCopy);
        //清空中间表和更新标志
        sTable = [];
        // tableIsChangded = false;
        return numbersCopy;

    }
    //send sw msg
    async sendMsg(msg, powerip) {
        let buf = new Buffer.from(msg)
        let returncode = 0;
        await server.send(buf, 0, buf.length, 7400, powerip, function (err, bytes) {
            returncode = err
            if (err) {
                console.log('send data err')
            } else {
                console.log("send data ok:", bytes)
            }
        });
        //server.send(buf, 0, buf.length, 7000, "192.168.1.145");
        console.log("给socket发送的请求命令数据为：" + buf.toString('hex'))
        return returncode;
    }
    //async send msg promise
    async sendMsgPromiseTimeout(token, msg, powerip) {
        // send msg to device
        let buf = new Buffer.from(msg)
        let returncode = 0
        server.send(buf, 0, buf.length, 7400, powerip, function (err, bytes) {
            returncode = err
            if (err) {
                console.log('send data err');
            } else {
                console.log("send data length=:", bytes);
            }
        });
        // return promise
        console.log("send data current token=:", token);
        let timer = null
        let err = {
            token: token
        }
        return Promise.race([
            new Promise((resolve, reject) => {
                //console.log('本次token=', token)
                timer = setTimeout(() => {
                    console.log('本次消息请求，超时未收到应答,token =', token)
                    reject(err)
                }, 3000)
            }), new Promise((resolve, reject) => {
                promisePool[token] = {
                    token,
                    resolve,
                    reject,
                    timer
                }
            })
        ])
    }
}
module.exports = PoweracService;

