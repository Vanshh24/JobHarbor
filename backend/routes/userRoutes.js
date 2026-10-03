import express from "express";
import { login, register, logout, getUser, getUserStats } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getUser);
router.get("/stats", getUserStats);

export default router;