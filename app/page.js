"use client";
import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ThemeToggle from "./components/ThemeToggle";
import UrlForm from "./components/UrlForm";
import ShortenedUrl from "./components/ShortenedUrl";
import History from "./history";
import { shortenUrl, addToHistory } from "./utils/urlHelpers";

export default function Home() {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [pastUrls, setPastUrls] = useLocalStorage("pastUrls", []);
    const [theme, setTheme] = useLocalStorage("theme", "light");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleError(error) {
        if (error) setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    const removeUrl = (id) => {
        setPastUrls((prevPastUrls) => prevPastUrls.filter((u) => u.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!url) {
            handleError("URL is required");
            return;
        }

        setLoading(true);
        try {
            await shortenUrl(
                url,
                setShortenedUrl,
                handleError,
                (oldUrl, newUrl) =>
                    addToHistory(
                        oldUrl,
                        newUrl,
                        setPastUrls,
                        handleError,
                        setUrl,
                        pastUrls
                    ),
                pastUrls
            );
            setUrl("");
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = ({ target: { value } }) => setUrl(value);
    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-base-100"
            data-theme={theme}
        >
            <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                <div className="flex justify-end mb-8">
                    <ThemeToggle
                        theme={theme}
                        onThemeChange={handleThemeChange}
                    />
                </div>

                <div className="flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        URL Shortener
                    </h1>

                    {error && (
                        <div
                            role="alert"
                            className="alert alert-error shadow-lg w-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 shrink-0 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <UrlForm
                        url={url}
                        onUrlChange={handleChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />

                    {shortenedUrl && (
                        <ShortenedUrl url={shortenedUrl} loading={loading} />
                    )}

                    <History
                        pastUrls={pastUrls}
                        removeUrl={removeUrl}
                        loading={loading}
                        setPastUrls={setPastUrls}
                    />
                </div>
            </main>
            <footer className="footer footer-center p-4 bg-base-200 text-base-content">
                <aside>
                    <p>
                        Copyright © {new Date().getFullYear()} - All rights
                        reserved by Anthony Duong
                    </p>
                </aside>
            </footer>
        </div>
    );
}
