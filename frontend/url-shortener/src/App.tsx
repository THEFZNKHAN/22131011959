import { motion } from "framer-motion";
import { ShortenUrl } from "./components/ShortenUrl";
import { UrlStats } from "./components/UrlStats";

function App() {
    return (
        <div>
            <div className="min-h-screen bg-blue-50 transition-colors duration-500">
                <header className="flex justify-between items-center p-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-blue-800">
                        MyShortly
                    </h1>
                </header>

                <main className="max-w-3xl mx-auto p-6 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <ShortenUrl />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <UrlStats />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

export default App;
