import { Router } from "express";
// import mockaroo from "../../modules/mockaroo";
import tester from "../../modules/sample";
import _ from "lodash";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let limit = req.query.limit;
    if (_.isEmpty(limit)) limit = 0;
    let rows = await tester.getBulkData(limit);
    // console.log(rows.);
    // console.log(req.query.limit);
    res.status(200).send(rows).end();
  } catch (error) {
    next(error);
  }
});

export default router;
