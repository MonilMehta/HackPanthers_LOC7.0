import { Router } from "express";
import { changeCurrentPassword, getCurrentCitizen, loginCitizen, logoutCitizen, refreshAccessToken, registerCitizen, updateAccountDetails, verifyCitizen } from "../controllers/citizen.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerCitizen);

router.route("/login").post(loginCitizen);

// secured routes
router.route("/logout").post(verifyJWT ,logoutCitizen)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentCitizen)

router.route("/update-details").patch(verifyJWT, updateAccountDetails)

router.route("/verify-citizen").patch(verifyJWT, verifyCitizen)

export default router