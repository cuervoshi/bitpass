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

const router: Router = express.Router({ mergeParams: true });

router.get("/", requireAuth, handleListDiscounts);

router.post(
  "/",
  requireAuth,
  validate(CreateDiscountSchema),
  handleCreateDiscount,
);

router.post(
  "/verify",
  requireAuth,
  validate(z.object({ code: z.string().min(1) })),
  handleValidateDiscount,
);

router.patch(
  "/:codeId",
  requireAuth,
  validate(UpdateDiscountSchema),
  handleUpdateDiscount,
);
router.delete("/:codeId", requireAuth, handleDeleteDiscount);

export default router;
