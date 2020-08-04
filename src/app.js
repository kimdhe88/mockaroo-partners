import express from "express";
import router from "./router";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(router.v1);

export default {
  server,
};
