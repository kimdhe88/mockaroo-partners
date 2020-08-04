import fs from "fs";
import path from "path";
import cliProgress from "cli-progress";

let datDir = path.join(__dirname, "data");

function getBar(barName) {
  const bar = new cliProgress.SingleBar(
    {
      format: `${barName} | {bar} | {value}/{total} - {percentage}%`,
    },
    cliProgress.Presets.rect
  );
  return bar;
}

let data = new Object();
data.company_name = JSON.parse(
  fs.readFileSync(path.join(datDir, "company_name.json"))
).list;
data.country = JSON.parse(
  fs.readFileSync(path.join(datDir, "country.json"))
).list;
data.email = JSON.parse(fs.readFileSync(path.join(datDir, "email.json"))).list;
data.first_name = JSON.parse(
  fs.readFileSync(path.join(datDir, "first_name.json"))
).list;
data.gender = JSON.parse(
  fs.readFileSync(path.join(datDir, "gender.json"))
).list;
data.ip_address = JSON.parse(
  fs.readFileSync(path.join(datDir, "ip_address.json"))
).list;
data.last_name = JSON.parse(
  fs.readFileSync(path.join(datDir, "last_name.json"))
).list;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function randomDraw(array = Array) {
  return array[(0, await random(0, array.length))];
}

async function newRows(id) {
  let tmp = new Object();
  tmp.id = id;
  tmp.first_name = await randomDraw(data.first_name);
  tmp.last_name = await randomDraw(data.last_name);
  tmp.gender = await randomDraw(data.gender);
  tmp.email = await randomDraw(data.email);
  tmp.country = await randomDraw(data.country);
  tmp.company_name = await randomDraw(data.company_name);
  tmp.ip_address = await randomDraw(data.ip_address);
  tmp.remark = "";
  return tmp;
}

async function getData(limit = 1) {
  try {
    let resultData = new Object();
    resultData.data = new Array();

    let bar = getBar("create rows");
    bar.start(limit, 0);
    // console.time("create data");
    for (let i = 1; i <= limit; i++) {
      resultData.data.push(await newRows(i));
      bar.update(i);
    }

    bar.stop();
    // console.timeEnd("create data");
    // console.log(resultData.data);
    return resultData.data;
  } catch (e) {
    throw e;
  }
}

export default {
  getData,
};
