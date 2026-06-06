import express from "express";
import { protectRoute } from "../middlewares/auth_middleware.js";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message_controller.js";

const router = express.Router();


router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages) //"/:id" - is the id that we would like to fetch our messages with

router.post("/send/:id", protectRoute, sendMessages)

export default router;  