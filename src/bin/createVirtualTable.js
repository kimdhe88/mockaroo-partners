import pg from "pg";

let drawRows = 15;

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

async function main() {
  let rtn;
  let pool = new pg.Pool(config);
  let data = await pool.query("select * from demo.bulk_data").then((res) => {
    return res.rows;
  });

  //   console.log(data);

  console.time("just copy : ");
  let vData = data;
  console.timeEnd("just copy : ");

  let searchText = "";
  console.time("Search : ");
  rtn = await search(data, searchText);
  console.timeEnd("Search : ");

  console.time("idx copy : ");
  rtn = await copyIdx(data);
  console.timeEnd("idx copy : ");

  console.time("using slice draw : ");
  await usingSliceDraw(data);
  console.timeEnd("using slice draw : ");

  console.time("using just dump : ");
  await usingJustPush(data);
  console.timeEnd("using just dump : ");

  console.time("using virtual table dump : ");
  await usingVirtualIndexArrayPush(data, rtn);
  console.timeEnd("using virtual table dump : ");

  //   console.log(rtn);
}

async function search(givenObj, searchText) {
  let idxArr = new Array();

  let returnObj = givenObj.filter((obj, index) => {
    let isSome = Object.values(obj).some((val) =>
      val ? val.toString().toLowerCase().includes(searchText) : false
    );
    if (isSome) idxArr.push(index);
  });

  return idxArr;
}

async function copyIdx(givenObj) {
  let idxArr = new Array();
  givenObj.filter((obj, index) => idxArr.push(index));
  return idxArr;
}

async function usingSliceDraw(givenObj = Array) {
  //   console.log(givenObj.length);
  let maximumDrawIndex = givenObj.length - drawRows - 1;
  //   console.log();
  for (let i = 0; i <= maximumDrawIndex; i++) {
    givenObj.slice(i, i + drawRows);
  }
}

async function usingJustPush(givenObj = Array) {
  //   console.log(givenObj.length);
  let maximumDrawIndex = givenObj.length - drawRows - 1;

  for (let i = 0; i <= maximumDrawIndex; i++) {
    let tmp = new Array();
    for (let j = i; j < i + drawRows; j++) tmp.push(givenObj[j]);
  }
}

async function usingVirtualIndexArrayPush(
  givenOrgData = Array,
  givenVtrIdxData = Array
) {
  //   console.log(givenObj.length);
  let maximumDrawIndex = givenVtrIdxData.length - drawRows - 1;

  for (let i = 0; i <= maximumDrawIndex; i++) {
    let tmp = new Array();
    for (let j = i; j < i + drawRows; j++)
      tmp.push(givenOrgData[givenVtrIdxData[j]]);
  }
}

main();
