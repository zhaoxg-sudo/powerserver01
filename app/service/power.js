const Service = require('egg').Service;
const { Pool, Client} = require('pg')
const dgram = require('dgram')
const server = dgram.createSocket('udp4');
const promisePool = [];
let session = 0;
let _this = this;
let alarmFiredFlag = false;
let alarmTable = [];
// 绑定本机的ip地址
server.bind(7300, '0.0.0.0');
// 开启socket 监听服务
server.on("message", function (msg, rinfo) {
let startRecDataFlag = 1
    let rcmsg = msg;
    console.log('已接收到设备端发送的数据：' + msg.toString('hex'));
    console.log("设备端地址信息为：", rinfo);
    let commType = parseInt(msg.toString('hex').slice(2,4),16);
    //需要，立即应答的
    let needAnswered = commType;
    if (needAnswered == 0x07 | needAnswered == 0x08){
        let buf = new Buffer.from(rcmsg);
        server.send(buf, 0, buf.length, rinfo.port, rinfo.address);
        console.log("给设备端的应答数据为："+ buf.toString('hex'));
        
    }
    
    //接收到消息处理
    

    if (startRecDataFlag){
        switch(commType)
        {
        case  0x08://心跳信息
        
             //取出心跳中的IP and phone number
             let tempTable = {id:"00000",ip:"0.0.0.0",number:"0",switchid:"0",name:"x1",status:"1"};
              tempTable.ip = rinfo.address;
             let number = "00000000";
             let n0 = msg.toString('hex').slice(6,8);
             //console.log(msg.toString('hex').slice(6,8));
             let n1 = msg.toString('hex').slice(8,10);
             let n2 = msg.toString('hex').slice(10,12);
             let n3 = msg.toString('hex').slice(12,14);
             number = parseInt((n3+n2+n1+n0),16);
             // console.log("设备端心跳消息的号码为："+number);
           
            // insert into alarm table or alarm DB
            // connect db
            /* const client = new Client({
                user: 'postgres',
                host: '127.0.0.1',
                database: 'power',
                password: 'shyh2017',
                port: 5432,
            })
            client.connect()
            // insert into alarm DB
            client.query('SELECT * from power_device_local').then( (data) => {
            comsole.log(data)
            })
         
            client.end()*/
             
            // end db 
            // reset alarm flag

            break;
        case 0x03://读取电源状态-应答处理
             let buf = new Buffer.from(rcmsg);
             console.log("0x03读取电源状态-应答处理，消息应答为：", buf); 
             //取出消息序列号
             let s0 = rcmsg.toString('hex').slice(48,50);
              //console.log(msg.toString('hex').slice(6,8));
              let s1 = rcmsg.toString('hex').slice(50,52);
              let s2 = rcmsg.toString('hex').slice(52,54);
              let s3 = rcmsg.toString('hex').slice(54,56);
              
              let token = parseInt(s0+s1+s2+s3,16);
                      
              console.log("收到设备端的应答数据为："+ buf.toString('hex'));
              msg = buf.toString('hex')
              let returnMsg = {
                  token: token,
                  msg: msg
              }
              console.log("0x03应答消息的序列号======："+s0+s1+s2+s3);  
             const key = token;    
             const req = promisePool[key]
             if (req) {
                req.resolve(returnMsg);
                clearTimeout(req.timer);
                console.log("=========0x03收到正确应答消息========，token=", token);
                delete promisePool[key];
             } else {
                    console.log("=========0x03消息过期或不明消息========", token);
             }     
            break;
        case 0x12://读取开关量状态-应答处理
                  //1,websocket 通知前台
                  //2,关闭消息应答超时定时器
            break;
        default :
        
    }
    
    }
    
    let searchMsg = [0xaa, 0x12, 0x15, 0xee, 0x03, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,0x00, 0x00, 0x00, 0x77];
    //server.send(Buffer.from(searchMsg), 0, Buffer.from(searchMsg).length, rinfo.port, rinfo.address);
    //console.log("发给客户端的数据为：",Buffer.from(searchMsg));
});

server.on("listening", function () {
    let address = server.address();
    console.log("socket服务器开始监听。地址信息为", address);
});

// power service
class PowerService extends Service {
    //get session ID
    async getSessionID() {

        if(session > 65535)
        session = 0;

        session = session+1;
        //this.ctx.app.io.emit('s',"w");   
        //console.log("调用了websocket。。。。")
        return session;
     }
    //send sw msg
    async sendMsg(msg,powerip) {

        let buf = new Buffer.from(msg)
        let returncode = 0;
         await server.send(buf, 0, buf.length, 7300, powerip, function (err, bytes) {
            returncode = err
            if (err) {
                console.log('send data err')
            } else {
                console.log("send data ok:", bytes)
            }
        });
        //server.send(buf, 0, buf.length, 7000, "192.168.1.145");
        console.log("给socket发送的请求命令数据为："+ buf.toString('hex'))
        return returncode;
    }

    //async send msg promise
    async sendMsgPromiseTimeout(token,msg,powerip){
         
       
        // send msg to device
        let buf = new Buffer.from(msg)
        let returncode = 0
        server.send(buf, 0, buf.length, 7300, powerip, function (err, bytes) {
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
              timer = setTimeout(()=>{console.log('本次消息请求，超时未收到应答,token =', token)
              reject(err)
              },200)
            }),new Promise((resolve, reject) => {
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
module.exports = PowerService;

