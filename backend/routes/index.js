import express from "express";
import { router as accountRoutes } from "./accountRoutes.js";
import { router as userRoutes } from "./userRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/account", accountRoutes);

export { router };
