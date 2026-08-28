import express from "express";
import { deleteJob, getAllJobs, getMyJobs, getJob, searchJobs, postJob, updateJob, countJobs, countByCategory } from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.get("/search", searchJobs)
router.post("/post", postJob);
router.get("/getmyjobs", getMyJobs);
router.get("/jobstats", countJobs);
router.get("/categorystats", countByCategory)
router.put("/update/:id", updateJob);
router.delete("/delete/:id", deleteJob);
router.get("/:id", getJob);

export default router;