import { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { ShortenUrl } from "./components/ShortenUrl";
import { UrlStats } from "./components/UrlStats";

function App() {
    const [shortcodes, setShortcodes] = useState<string[]>([]);

    const addShortcode = (shortcode: string) => {
        setShortcodes((prev) => [...new Set([...prev, shortcode])]);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#e3f2fd", py: 4 }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        MyShortly
                    </Typography>
                </Box>
                <Box
                    sx={{
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <ShortenUrl addShortcode={addShortcode} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <UrlStats shortcodes={shortcodes} />
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
}

export default App;
