import express, { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../lib/middlewares/require-auth.middleware.js";
import { validate } from "../lib/middlewares/validate.middleware.js";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
} from "../lib/validators/discount.schema.js";
import {
  handleListDiscounts,
  handleCreateDiscount,
  handleUpdateDiscount,
  handleDeleteDiscount,
  handleValidateDiscount,
} from "../controllers/discount.controller.js";
import { requireEventRole } from "../lib/middlewares/required-event-role.middleware.js";

const router: Router = express.Router({ mergeParams: true });

router.get(
  "/",
  requireAuth,
  requireEventRole(["OWNER", "MODERATOR"]),
  handleListDiscounts,
);

router.post(
  "/",
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(CreateDiscountSchema),
  handleCreateDiscount,
);

router.patch(
  "/:codeId",
  requireAuth,
  requireEventRole(["OWNER"]),
  validate(UpdateDiscountSchema),
  handleUpdateDiscount,
);

router.delete(
  "/:codeId",
  requireAuth,
  requireEventRole(["OWNER"]),
  handleDeleteDiscount,
);

router.post(
  "/verify",
  requireAuth,
  validate(z.object({ code: z.string().min(1) })),
  handleValidateDiscount,
);

export default router;
