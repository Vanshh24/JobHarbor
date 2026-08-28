import express from "express";
import messageController from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all-users", messageController.getUsers);
router.get("/messages", isAuthenticated, messageController.getMessages);
router.get("/all-chats", isAuthenticated, messageController.getRecentChats);
router.post("/send/:id", messageController.sendMessage);

export default router;