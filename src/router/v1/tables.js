import { Router } from "express";
import tester from "../../modules/sample";
import _ from "lodash";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let limit = req.query.limit;
    if (_.isEmpty(limit)) limit = 0;
    let rows = await tester.getOriginalDatas(limit);
    res.status(200).send(rows).end();
  } catch (error) {
    next(error);
  }
});

export default router;
