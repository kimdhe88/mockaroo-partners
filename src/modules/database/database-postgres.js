"use strict";

import { Pool } from "pg";
import _, { isUndefined } from "lodash";

let instance;

export default class DatabasePostgres {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.pool;
    this.config;
    this.isDebug = true;
  }

  debugLog(text) {
    if (this.isDebug) console.log(text);
  }

  connect(config) {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.isConnection() && _.isEqual(this.config, config)) {
          resolve(true);
          return;
        }

        this.config = config;
        this.pool = new Pool(config);
        resolve(true);
      } catch (e) {
        console.log(`connect failed : \n${e}`);
        reject(e);
      }
    });
  }

  query(sql, param) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isConnection)
          throw new Error("먼저 connect() 함수를 수행해야 합니다. ");
        await this.pool.query(sql, param).then((res) => {
          resolve(res.rows);
        });
      } catch (e) {
        console.log(`query failed : \n${e}`);
        console.log(`query failed`);
        console.log(sql, param);
        reject(e);
      }
    });
  }

  transaction(sqlObjectList) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isConnection)
          throw new Error("먼저 connect() 함수를 수행해야 합니다. ");
        if (!(sqlObjectList instanceof Array))
          throw new Error(
            "The argument value of transaction() must be an array."
          );

        for (let idx in sqlObjectList) {
          if (!sqlObjectList[idx].hasOwnProperty("sql"))
            throw new Error(
              `The ${idx}'th sql object does not have a 'sql' property.`
            );
          if (!sqlObjectList[idx].hasOwnProperty("params"))
            throw new Error(
              `"The ${idx}'th sql object does not have a 'params' property.`
            );
          if (!(sqlObjectList[idx].params instanceof Array))
            throw new Error(
              `The 'param' property of the ${idx}'th sql object must be an array.`
            );
        }

        await this.query("begin");
        for (let idx in sqlObjectList) {
          await this.query(
            sqlObjectList[idx].sql,
            sqlObjectList[idx].params
          ).catch(async (err) => {
            await this.query("rollback");
            throw err;
          });
        }
        await this.query("commit");
        resolve(true);
      } catch (e) {
        console.log(`transaction failed : \n${e}`);
        reject(e);
      }
    });
  }

  isConnection() {
    if (_.isObject(this.pool)) return !this.pool.ended;
    else return false;
  }

  async isConnectable() {
    try {
      return await this.query("SELECT NOW()")
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } catch (e) {
      throw e;
    }
  }

  async disconnect() {
    try {
      this.pool.end;
      this.debugLog(`session disconnect()`);
    } catch (e) {
      throw e;
    }
  }

  getField(tableName) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.pool.query(`select * from ${tableName}`).then((res) => {
          resolve(res.fields);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
