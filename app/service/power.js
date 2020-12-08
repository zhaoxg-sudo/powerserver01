const Service = require('egg').Service;
const { Pool, Client} = require('pg')
const dgram = require('dgram')
const server = dgram.createSocket('udp4');
// 绑定本机的ip地址
server.bind(7000, '0.0.0.0');
// 开启socket 监听服务
server.on("message", function (msg, rinfo) {
let startRecDataFlag = 1
    let rcmsg = msg;
    console.log('已接收到客户端发送的数据：' + msg.toString('hex'));
    console.log("客户端地址信息为：", rinfo);
    let commType = parseInt(msg.toString('hex').slice(2,4),16);
    //需要，立即应答的
    let needAnswered = commType;
    if (needAnswered == 0x02 | needAnswered == 0x03){
        let buf = new Buffer.from(rcmsg);
        server.send(buf, 0, buf.length, rinfo.port, rinfo.address);
        console.log("给客户端的应答数据为："+ buf.toString('hex'));
    }
    
    //接收到消息处理
    

    if (startRecDataFlag){
        switch(commType)
        {
        case  0x03://insert switch table
        
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
             console.log("消息的号码为："+number);
             
           
            break;
        case 0x11://设置开关量状态-应答处理
                
                  
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

