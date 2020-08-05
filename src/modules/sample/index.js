import pg from "pg";
let config = {
  host: "192.168.10.243",
  port: "5432",
  user: "postgres",
  password: "sinsiway",
  database: "postgres",
  max: "20",
  connectionTimtoutMillis: "30000",
  idleTimeoutMillis: "1000",
};

let pool = new pg.Pool(config);

async function getBulkData(limit = 1) {
  try {
    let sql = "";
    let rows = new Object();
    if (limit === 0) {
      sql = "select * from demo.bulk_data order by id";
      rows = await pool.query(sql).then((res) => {
        return res.rows;
      });
    } else {
      sql = "select * from demo.bulk_data order by id limit $1";
      let param = new Array();
      param.push(limit);
      rows = await pool.query(sql, param).then((res) => {
        return res.rows;
      });
    }
    // console.log(rows);
    return rows;
  } catch (e) {
    throw e;
  }
}

async function getOriginalDatas(limit = 1) {
  try {
    let sql = "";
    let rows = new Object();
    if (limit === 0) {
      sql = "select * from demo.bulk_data order by id";
      rows = await pool.query(sql).then((res) => {
        return res.rows;
      });
    } else {
      sql = "select * from demo.bulk_data order by id limit $1";
      let param = new Array();
      param.push(limit);
      rows = await pool.query(sql, param).then((res) => {
        return res;
      });
    }
    // console.log(rows);
    return rows;
  } catch (e) {
    throw e;
  }
}

export default { getBulkData, getOriginalDatas };
