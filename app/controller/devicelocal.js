'use strict';

const Controller = require('egg').Controller;
const { Pool, Client } = require('pg')


class DevicelocalController extends Controller {

  // getrunstatus
  async devicelocalgetrunstatus() {
    
    //connect db
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'power',
        password: 'shyh2017',
        port: 5432,
      })
      console.log("enter devicelocalgetrunstatus", this.ctx.params)
      client.connect()
      let thisctx = this.ctx
      let catalogid = this.ctx.params.catalogid
      let token = 0
      let sendArr = []
      let ip
      let data = {}
      data.result = {}
      console.log("catalog id =", catalogid)
      let nodedata = await client.query('SELECT * from power_station_tree where catalogid =' + "'" + catalogid + "'")
      // console.log("return catalog data", nodedata)
      if (nodedata.rows.length > 0) {
        // data.code = 1
        // data.result = nodedata.rows
        console.log("return catalog rows", nodedata.rows)
        let deviceip = nodedata.rows[0].ipaddress
        ip = deviceip
        console.log("return device ip = ", deviceip)
        let resultArr = [0xaa,3,6,0xff,0,0,0,55,0];
        // 计算checksum
        let checksum = 0;
        for (var i = 3; i < 8; i++) {
            checksum = checksum + resultArr[i];//从Sip号码开始到命令序号共20个字节的和
            //console.log(checksum);
        }
        
        checksum = checksum % 128; //取128的模
        checksum &=  0xff;//去掉可能有的高位
        console.log('checksum=', checksum);
        resultArr[8] = checksum;

   let sid = 0;
   sid = await this.ctx.service.power.getSessionID();
   token = sid
   //console.log("SESSION ID ="+SESSION);
   //消息插入序列号
   {
    //1,十进制转4字节字符串
    let sidString = "00000000";
    let sidX = parseInt(sid).toString(16);
    let sidXstring = sidString.slice(0,(8 - sidX.length)) +sidX;
    //2,提取4字节字符串
    let s19 = sidXstring.slice(0,2);
    console.log(s19);
    //console.log(planXstring);
    let s20 = sidXstring.slice(2,4);
    console.log(s20);
    //console.log(planXstring);
    let s21 = sidXstring.slice(4,6);
    console.log(s21);
    //console.log(planXstring);
    let s22 = sidXstring.slice(6,8);
    console.log("=====插入的序列号为：=====")
    console.log(s19+s20+s21+s22);
    //3,复制序列号并重新计算sum
    resultArr[7] = parseInt(s22,16);
    resultArr[6] = parseInt(s21,16);
    resultArr[5] = parseInt(s20,16);
    resultArr[4] = parseInt(s19,16);
    checksum = 0;    
         for (var i = 3; i < 8; i++) {
             checksum = checksum + resultArr[i];//从Sip号码开始到命令序号共20个字节的和
             //console.log(checksum);
         }
         
         checksum = checksum % 128; //取128的模
         checksum &=  0xff;//去掉可能有的高位
         console.log('插入token 后的checksum=', checksum);
         resultArr[8] = checksum;
         console.log("&&&***&^%%$$####发送数据:");
         console.log(Buffer.from(resultArr))
         sendArr = resultArr
        
      }
        console.log("预发送数据:");
        console.log(Buffer.from(resultArr))
        /*let err= await this.ctx.service.power.sendMsg(Buffer.from(resultArr),deviceip);
        if (err) {
            console.log('---switch on cmd is err---');
        } else {
            console.log("---switch on cmd is ok---");
        }*/
      } else {
        data.code = 2
        console.log("catalog data is not exist , catalog= ", catalogid)
      }
      await this.ctx.service.power.sendMsgPromiseTimeout(token,Buffer.from(sendArr),ip)
                    .then((e)=>{
                        console.log("promise resolve 处理结束-----------------",e);
                        let receiveMsg = e.msg
                        let code = 1   
                        data = {result:receiveMsg,code:code}
                       
                        thisctx.body = data 
                    })
                    .catch((e)=>{
                        console.log("promise reject 处理超时？？？？？？？？？",e);
                        let receiveMsg = {}
                        let code = -1
                        data = {result:receiveMsg,code:code}
                       
                        thisctx.body = data 
                    })
      
      // close db
      client.end()

      // this.ctx.body = data

    
  }
}
module.exports = DevicelocalController;