export const log = async (
    stack: string,
    level: string,
    pkg: string,
    message: string
) => {
    try {
        await fetch("http://localhost:5000/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stack, level, package: pkg, message }),
        });
    } catch {
        // Silent fail
    }
};
