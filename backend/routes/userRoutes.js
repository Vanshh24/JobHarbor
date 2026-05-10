import express from "express";
import cookieParser from "cookie-parser";
import { login, register, logout, getUser, getUserStats } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
const app = express();

app.use(cookieParser());

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);
router.get("/stats", getUserStats);

export default router;
