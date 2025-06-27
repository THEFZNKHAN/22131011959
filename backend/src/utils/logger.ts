import axios from "axios";

interface LogEntry {
    stack: string;
    level: string;
    package: string;
    message: string;
}

let log: (entry: LogEntry) => Promise<void>;

export const initLogger = (token: string) => {
    log = async (entry: LogEntry) => {
        try {
            await axios.post(
                "http://20.244.56.144/evaluation-service/logs",
                entry,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            // Silent fail
        }
    };
};

export const logger = (entry: LogEntry) => {
    if (!log) {
        throw new Error("Logger not initialized");
    }
    return log(entry);
};
