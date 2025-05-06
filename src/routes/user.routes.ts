import express, { Router } from "express";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import {
  handleGetProfile,
  handleGetPaymentMethods,
  handleAddLightning,
  handleDeletePaymentMethod,
  handleUpdateLightning,
} from "../controllers/user.controller.js";
import { validate } from "../lib/middlewares/validate.middleware.js";
import { CreateLightningSchema } from "../lib/validators/payment.schema.js";

const router: Router = express.Router();

router.get("/me", requireAuth, handleGetProfile);

router.get("/me/payment-methods", requireAuth, handleGetPaymentMethods);

router.post(
  "/me/payment-methods/lightning",
  requireAuth,
  validate(CreateLightningSchema),
  handleAddLightning,
);

router.patch(
  "/me/payment-methods/:pmId/lightning",
  requireAuth,
  validate(CreateLightningSchema),
  handleUpdateLightning,
);

router.delete(
  "/me/payment-methods/:pmId",
  requireAuth,
  handleDeletePaymentMethod,
);

export default router;
