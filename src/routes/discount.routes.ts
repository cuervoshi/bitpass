import express, { Router } from "express";
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
} from "../controllers/discount.controller.js";

const router: Router = express.Router({ mergeParams: true });

router.get("/", requireAuth, handleListDiscounts);
router.post(
  "/",
  requireAuth,
  validate(CreateDiscountSchema),
  handleCreateDiscount,
);
router.patch(
  "/:codeId",
  requireAuth,
  validate(UpdateDiscountSchema),
  handleUpdateDiscount,
);
router.delete("/:codeId", requireAuth, handleDeleteDiscount);

export default router;
