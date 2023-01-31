const Service = require('egg').Service;
const { Pool, Client} = require('pg')

class DbService extends Service {
  // alarm fired
  async alarmFiredCheck(request) {
    //connect db
    // console.log('alarmFiredCheck:=\n', request)
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'power',
      password: 'shyh2017',
      port: 5432,
    })
    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    client.connect()
    let alarmdetail = request.alarmdetail
    let alarmmudid = request.alarmmudid
    // console.log('request=\n', request)
    console.log('alarmFiredCheck@@@@@@@@@@ alarmdetail=\n', alarmdetail)
    console.log('alarmFiredCheck@@@@@@@@@@ alarmmudid=\n', alarmmudid)
    let  data = await client.query('SELECT * from power_alarm_current where alarmdetail =' + "'" +  alarmdetail + "'" + " and alarmmudid = " + "'" + alarmmudid + "'")
    client.end()
    //end db
    console.log('alarmFiredCheck   db return=\n', data.rows)
    return data.rows
  }
  // current alarm del
  async delCurrentAlarmOne(alarmid) {
    //connect db
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'power',
      password: 'shyh2017',
      port: 5432,
    })
    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    client.connect()
    // 需要修改的数据
    let data = await client.query('DELETE from power_alarm_current where alarmid =' + "'" + alarmid + "'")
    client.end()
    //end db
    console.log('currentAlarmDelOne=', data)
    return data.rows
  }
  // get current alarm one
  async getCurrentAlarmOne(alarmid) {
    //connect db
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'power',
      password: 'shyh2017',
      port: 5432,
    })
    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
      client.connect()
      console.log("current alarm  alarmid=", alarmid)
      let  data = await client.query('SELECT * from power_alarm_current where alarmid =' + "'" +  alarmid + "'")
      client.end()
    //end db
    console.log('getCurrentAlarmOne=', data.rows)
    return data.rows
  }
  //获取所有报警设备数据库
  async readAllCurrentAlarm() {
    //connect db
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
    return db.rows;
  }
    //新增alarm记录
  async insertCurrentAlarmDb(insertAlarm) {
  
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'power',
        password: 'shyh2017',
        port: 5432,
    })
    client.connect() 
    
    let insertSql = "insert into power_alarm_current (alarmid,alarmstation,alarmmudid,alarmreceivedtime,alarmfiredtime,alarmdetail,alarmreason,alarmlevel,alarmconfirmedflag,alarmconfirmedtime,alarmconfirmedinfo,alarmrestoreflag,alarmrestoreinfo,alarmsourceip,alarmaddition) \
      values ("+ "'"+insertAlarm.alarmid+"'"+",\
              "+ "'"+insertAlarm.alarmstation+"'"+",\
              "+ "'"+insertAlarm.alarmmudid+"'"+",\
              "+ "'"+insertAlarm.alarmreceivedtime+"'"+",\
              "+ "'"+insertAlarm.alarmfiredtime+"'"+",\
              "+ "'"+insertAlarm.alarmdetail+"'"+",\
              "+ "'"+insertAlarm.alarmreason+"'"+",\
              "+ "'"+insertAlarm.alarmlevel+"'"+",\
              "+ "'"+insertAlarm.alarmconfirmedflag+"'"+",\
              "+ "'"+insertAlarm.alarmconfirmedtime+"'"+",\
              "+ "'"+insertAlarm.alarmconfirmedinfo+"'"+",\
              "+ "'"+insertAlarm.alarmrestoreflag+"'"+",\
              "+ "'"+insertAlarm.alarmrestoreinfo+"'"+",\
              "+ "'"+insertAlarm.alarmsourceip+"'"+",\
              "+ "'"+insertAlarm.alarmaddition+"'"+")";
    console.log(insertSql);
    let insertErr = await client.query(insertSql);
    if (insertErr)
      console.log("insertCurrentAlarmDb---db服务，新增alarm数据库记录：",insertAlarm); 
      else console.log("insertCurrentAlarmDb---db服务，新增alarm数据库记录失败？？？？？？？：",insertAlarm); 
    
    client.end();
    return insertErr;
  }
  // insert to 历史告警
  async insertToHistoryAlarmOne(insertAlarm) {
    //connect db
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'power',
      password: 'shyh2017',
      port: 5432,
    })
    // the pool with emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    client.connect()
    console.log("---insertToHistoryAlarmOne，新增history alarm数据库记录：",insertAlarm); 
    let insertSql = "insert into power_alarm_history (alarmid,alarmstation,alarmmudid,alarmreceivedtime,alarmfiredtime,alarmdetail,alarmreason,alarmlevel,alarmconfirmedflag,alarmconfirmedtime,alarmconfirmedinfo,alarmrestoreflag,alarmrestoreinfo,alarmsourceip,alarmaddition) \
      values ("+ "'"+insertAlarm.alarmid+"'"+",\
              "+ "'"+insertAlarm.alarmstation+"'"+",\
              "+ "'"+insertAlarm.alarmmudid+"'"+",\
              "+ "'"+insertAlarm.alarmreceivedtime+"'"+",\
              "+ "'"+insertAlarm.alarmfiredtime+"'"+",\
              "+ "'"+insertAlarm.alarmdetail+"'"+",\
              "+ "'"+insertAlarm.alarmreason+"'"+",\
              "+ "'"+insertAlarm.alarmlevel+"'"+",\
              "+ "'"+insertAlarm.alarmconfirmedflag+"'"+",\
              "+ "'"+insertAlarm.alarmconfirmedtime+"'"+",\
              "+ "'"+insertAlarm.alarmconfirmedinfo+"'"+",\
              "+ "'"+insertAlarm.alarmrestoreflag+"'"+",\
              "+ "'"+insertAlarm.alarmrestoreinfo+"'"+",\
              "+ "'"+insertAlarm.alarmsourceip+"'"+",\
              "+ "'"+insertAlarm.alarmaddition+"'"+")";
    console.log(insertSql);
    let insertErr = await client.query(insertSql);
    if (insertErr)
      console.log("---insertToHistoryAlarmOne，新增history alarm数据库记录：",insertAlarm); 
      else console.log("---insertToHistoryAlarmOne，新增alarm历史数据库记录失败？？？？？？？：",insertAlarm); 
    client.end()
    //end db
    return insertErr
  }
  // getAllAcDeviceList
  async getAllAcDeviceList() {
      //link db
      const client = new Client({
        user: 'postgres',
          host: '127.0.0.1',
          database: 'power',
          password: 'shyh2017',
          port: 5432,
      })    
     client.connect();
     let protocoltype = 2
     let listSql = 'SELECT * from power_station_tree where protocoltype =' + "'" + protocoltype + "'";
     //console.log(clearSql);
     let db =  await client.query(listSql);
      
     // console.log("---db服务，获取AC设备列表：",db.rows);
     client.end();   
     return db.rows;
  }
}
module.exports = DbService;
