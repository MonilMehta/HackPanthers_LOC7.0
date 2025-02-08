import { createReport } from "../controllers/report/registerReport.js";
import { Router } from "express";

const router = Router();

router.route("/registerReport").post(createReport);

export default router