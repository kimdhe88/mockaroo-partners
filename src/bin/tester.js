// import db from "../modules/database";
import pg from "pg";
import mockaroo from "../modules/mockaroo";
import cliProgress from "cli-progress";
import fs from "fs";

function getBar(barName) {
  const bar = new cliProgress.SingleBar(
    {
      format: `${barName} | {bar} | {value}/{total} - {percentage}%`,
    },
    cliProgress.Presets.rect
  );
  return bar;
}

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

async function sleep(sec) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
}

async function insertData() {
  try {
    let pool = new pg.Pool(config);
    let bar = getBar("insert rows");

    let dataCount = 500000;
    let rows = await mockaroo.getData(dataCount);

    let sql =
      "insert into demo.bulk_data values($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    // let sql = "select * from pg_tables";
    let tmpRows = "";
    bar.start(dataCount, 0);
    for (let i = 0; i < rows.length; i++) {
      // let tmpRows = new Array();

      let row = rows[i];
      //   for (let key in row) tmpRows.push(row[key]);
      for (let key in row) {
        if (key === "remark") tmpRows += row[key] + "\n";
        else tmpRows += row[key] + "^";
      }
      //   await pool.query(sql, tmpRows);
      //   await pool.query(sql);
      //   console.log(tmpRows);
      bar.update(i + 1);
    }

    fs.writeFileSync(
      "C:\\Users\\sinsiway-rnd\\Downloads\\bulk_data.csv",
      tmpRows
    );
    bar.stop();
    pool.end();
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  try {
    let pool = new pg.Pool(config);

    pool.on("connect", (client) => {
      console.log(`${client.secretKey} connect!`);
    });

    pool.on("acquire", (client) => {
      console.log(`${client.secretKey} acquire!`);
    });

    pool.on("remove", (client) => {
      console.log(`${client.secretKey} remove!`);
    });

    console.log(`pool.totalCount : ${pool.totalCount}`);

    pool.query("select * from public.build_server");
    await sleep(1);
    pool.query("select * from public.build_server");
    pool.query("select * from public.build_server");
    pool.query("select * from public.build_server");
    await sleep(1);
    pool.query("select * from public.build_server");
    await sleep(1);
    pool.query("select * from public.build_server");

    console.log(`pool.totalCount : ${pool.totalCount}`);

    pool.end();
  } catch (e) {
    console.log(e.message);
  }
}

// main();
insertData();
