import express, { Router } from "express";

import { handleRequestOtp } from "../controllers/auth.controller.js";
import { handleVerifyOtp } from "../controllers/auth.controller.js";
import { handleVerifyNostr } from "../controllers/auth.controller.js";

const router: Router = express.Router();

router.post("/request-otp", handleRequestOtp);
router.post("/verify-otp", handleVerifyOtp);
router.post("/verify-nostr", handleVerifyNostr);

export default router;
