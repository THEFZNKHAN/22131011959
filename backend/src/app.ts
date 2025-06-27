import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { initLogger, logger } from "./utils/logger";
import urlRoutes from "./routes/urlRoutes";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

const allowed = [ 'http://localhost:3000', 'http://localhost:5173' ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options("*", cors());

const getAccessToken = async () => {
    const authData = {
        email: process.env.EMAIL,
        name: process.env.NAME,
        rollNo: process.env.ROLL_NO,
        accessCode: process.env.ACCESS_CODE,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    };
    try {
        const response = await axios.post(
            "http://20.244.56.144/evaluation-service/auth",
            authData
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Failed to get access token:", error);
        process.exit(1);
    }
};

getAccessToken().then((token) => {
    initLogger(token);
    app.listen(5000, () => {
        logger({
            stack: "backend",
            level: "info",
            package: "app",
            message: "Server started on port 5000",
        });
    });
});

app.post("/logs", (req, res) => {
    const { stack, level, pkg, message } = req.body;
    if (!stack || !level || !pkg || !message) {
        return res.status(400).json({ error: "Invalid log data" });
    }
    logger({ stack, level, package: pkg, message });
    res.status(200).json({ message: "Log sent" });
});

app.use("/", urlRoutes);
