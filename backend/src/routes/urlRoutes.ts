import express from "express";
import {
    createShortUrl,
    getUrlStats,
    redirectToUrl,
} from "../controllers/urlController";

const router = express.Router();

router.post("/shorturls", createShortUrl);
router.get("/shorturls/:shortcode", getUrlStats);
router.get("/:shortcode", redirectToUrl);

export default router;
