import { Router } from "express";
import path from "path";
import datas from "./datas";

const router = Router();
const prefix = "api";
const version = path.basename(__dirname);

router.use(`/${prefix}/${version}/datas`, datas);

export default router;
