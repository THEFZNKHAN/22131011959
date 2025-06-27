import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface LoggerConfig {
    token: string;
    endpoint: string;
}

interface LogEntry {
    stack: string;
    level: string;
    package: string;
    message: string;
}

export function createLogger(token: string) {
    const config: LoggerConfig = {
        token,
        endpoint: "http://20.244.56.144/evaluation-service/logs",
    };

    return async function log(
        stack: string,
        level: string,
        pkg: string,
        message: string
    ): Promise<void> {
        const logEntry: LogEntry = { stack, level, package: pkg, message };

        try {
            await axios.post(config.endpoint, logEntry, {
                headers: {
                    Authorization: `Bearer ${config.token}`,
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            });
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                if (error instanceof Error) {
                    console.error("Log failed:", error.message);
                } else {
                    console.error("Log failed:", error);
                }
            }
        }
    };
}
