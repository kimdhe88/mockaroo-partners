import { Router } from "express";
import path from "path";
import datas from "./datas";
import tables from "./tables";

const router = Router();
const prefix = "api";
const version = path.basename(__dirname);

router.use(`/${prefix}/${version}/datas`, datas);
router.use(`/${prefix}/${version}/tables`, tables);

export default router;
