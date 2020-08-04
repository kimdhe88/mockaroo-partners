import fs from "fs";
import path from "path";

async function isFile(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

async function addKeyFiles(givenList = Array, key = String) {
  try {
    let dataFilePath = path.join(__dirname, "data", `${key}.json`);
    let dataObject = new Object();
    if (await isFile(dataFilePath))
      dataObject = await JSON.parse(fs.readFileSync(dataFilePath));
    else dataObject.list = new Array();

    let orgCount = dataObject.list.length;
    for (let idx in givenList) {
      let givenData = givenList[idx][key];
      if (!(await dataObject.list.includes(givenData)))
        await dataObject.list.push(givenData);
    }

    let resultCount = dataObject.list.length;
    let addCount = resultCount - orgCount;

    // console.log(
    //   `[ ${key} ] Originally [ ${orgCount} ] to [ ${addCount} ] was added to become [ ${resultCount} ]. `
    // );

    fs.writeFileSync(dataFilePath, JSON.stringify(dataObject));
  } catch (e) {
    throw e;
  }
}
async function addMockarooJson() {
  try {
    let targetDir = "C:\\Users\\sinsiway-rnd\\Downloads";
    let targetPrefix = "MOCK_DATA";
    let targetList = fs.readdirSync(targetDir);
    for (let idx in targetList) {
      let target = targetList[idx];
      let extension = path.extname(target);
      if (extension !== ".json") continue;
      let basename = path.basename(target, extension);

      if (basename.includes(targetPrefix)) {
        let filename = path.basename(target);
        let dataList = JSON.parse(
          fs.readFileSync(path.join(targetDir, filename))
        );

        if (dataList.length === 0) continue;
        let keys = Object.keys(dataList[0]);

        for (let keyIdx in keys) await addKeyFiles(dataList, keys[keyIdx]);

        fs.unlinkSync(path.join(targetDir, target));
        console.log(`"${target}" 파일을 추가 후 삭제하였습니다.`);
      }
    }
  } catch (e) {
    throw e;
  }
}

async function getDataList() {
  try {
    let dataPath = path.join(__dirname, "data");
    let fileList = fs.readdirSync(dataPath);
    for (let idx in fileList) {
      let filename = fileList[idx];
      let extension = path.extname(filename);
      let basename = path.basename(filename, extension);

      let dataObject = JSON.parse(
        fs.readFileSync(path.join(dataPath, filename))
      );
      let dataCount = dataObject.list.length;
      console.log(`"${basename}" has "${dataCount}"`);
    }
  } catch (e) {
    throw e;
  }
}

export default { addMockarooJson, getDataList };
