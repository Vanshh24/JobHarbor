import express from "express";
import { chat } from "../controllers/assistantController.js";
const assistantRouter = express.Router();

assistantRouter.post("/chat", chat);

export default assistantRouter;