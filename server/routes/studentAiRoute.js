import express from "express";
import { studentAssist } from "../controllers/studentAiController.js";

const router = express.Router();

router.post("/student-assist", studentAssist);

export default router;
