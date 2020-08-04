import mockaroo from "../modules/mockaroo";

async function main() {
  try {
    await mockaroo.addMockarooJson();
    await mockaroo.getDataList();
  } catch (e) {
    console.log(e);
  }
}

main();
