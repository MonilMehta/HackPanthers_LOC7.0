import { Router } from "express";
import {applyLeave} from "../controllers/Leave/applyLeave.js";
import { getLeaves } from "../controllers/Leave/getLeave.js";

const router = Router();

router.route("/applyLeave").post(applyLeave);
router.route("/getLeave").get(getLeaves);

export default router


