import { createReport } from "../controllers/report/registerReport.js";
import { Router } from "express";
import { getAllReports } from "../controllers/report/getReport.js";
const router = Router();

router.route("/registerReport").post(createReport);
router.route("/getReport").get(getAllReports);

export default router