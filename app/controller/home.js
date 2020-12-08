'use strict';

const Controller = require('egg').Controller;
const { Pool, Client } = require('pg')


class HomeController extends Controller {
  async index() {
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
    // callback - checkout a client
      
      let  data = await client.query('SELECT * from power_device_local')
      //.then((res)=>{
      //  this.data = res.rows
        client.end()
      //})
     

    //end db 
    const { ctx } = this;
    //ctx.body = 'hi, egg';
    ctx.body = data.rows
  }
}

module.exports = HomeController;
