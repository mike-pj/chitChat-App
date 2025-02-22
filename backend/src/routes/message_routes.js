import express from "express";
import { protectRoute } from "../middlewares/auth_middleware";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message_controller";

const router = express.Router();


router.get("/user", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessages)

export default router;  