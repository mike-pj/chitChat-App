import express from "express";
import { protectRoute } from "../middlewares/auth_middleware.js";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message_controller.js";

const router = express.Router();


router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessages)

export default router;  