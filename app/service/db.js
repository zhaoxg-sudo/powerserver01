const Service = require('egg').Service;
const { Pool, Client} = require('pg')

class DbService extends Service {
    //获取所有报警设备数据库
    async readAllCurrentAlarm() {

        const client = new Client({
            user: 'postgres',
            host: '127.0.0.1',
            database: 'power',
            password: 'shyh2017',
            port: 5432,
          })
          client.connect() 
          let sql = "SELECT * from power_alarm_current"
          let db = await client.query(sql);
          
          client.end() 
          return db;

    }
    //新增alarm记录
    async insertAlarmDb(t) {
      //link db
      let table = [];
      let insertTable = [];
      table = t;

      const client = new Client({
          user: 'postgres',
          host: '127.0.0.1',
          database: 'power',
          password: 'shyh2017',
          port: 5432,
      })
      client.connect() 
      
      for (let i=0,length = table.length ;i < length;i++)
      {
        insertTable = table[i];
        console.log("element:"+i+insertTable);
        let insertSql = "insert into power_alarm_current (alarmid,alarmstation,alarmmudid,alarmreceivedtime,alarmfiredtime,alarmdetail,alarmreason,alarmlevel,alarmconfirmedflag,alarmconfirmedtime,alarmconfirmedinfo,alarmrestoreflag,alarmrestoreinfo,alarmsourceip,alarmaddition) \
        values ("+ "'"+JSON.stringify(insertTable.alarmid)+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmstation)+"'"+",\
                "+ "'"+insertTable.alarmmudid+"'"+",\
                "+ "'"+insertTable.alarmreceivedtime+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmfiredtime)+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmdetail)+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmreason)+"'"+",\
                "+ "'"+insertTable.alarmlevel+"'"+",\
                "+ "'"+insertTable.alarmconfirmedflag+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmconfirmedtime)+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmconfirrmedinfo)+"'"+",\
                "+ "'"+insertTable.alarmrestoreflag+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmrestoreinfo)+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmsourceip)+"'"+",\
                "+ "'"+JSON.stringify(insertTable.alarmaddition)+"'"+")";
        console.log(insertSql);
        let insertErr = await client.query(insertSql);
        if (insertErr)
          console.log("---db服务，新增alarm数据库记录：",insertTable); 
          else console.log("---db服务，新增alarm数据库记录失败？？？？？？？：",insertTable); 
      };
     
      client.end();
      return insertTable;
    }

    //clear all
   
    async clearDeviceAllDb() {
      //link db
      const client = new Client({
        user: 'freeswitch',
        host: '127.0.0.1',
        database: 'ipbc',
        password: 'y2u4evam',
        port: 5432, 
      })
       
     client.connect();
     let clearSql = "truncate table alarm_link_device";
     //console.log(clearSql);
     let insertErr =  await client.query(clearSql);
      
     console.log("---db服务，清除开关量数据库：",insertErr);
     client.end();   
     return insertErr;
    }

}
module.exports = DbService;
