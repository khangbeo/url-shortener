"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Button from "./components/Button";
import History from "./history";
import { LuShrink } from "react-icons/lu";
import { FaClipboardList } from "react-icons/fa";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [pastUrls, setPastUrls] = useLocalStorage("pastUrls", []);
    const [theme, setTheme] = useLocalStorage("theme", "light");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [currentCopiedUrl, setCurrentCopiedUrl] = useState(null);

    function isInHistory(newUrl) {
        return pastUrls.some((url) => url.oldUrl === newUrl.oldUrl);
    }

    const shortenUrl = async (url) => {
        setLoading(true);
        const baseUrl = `/api/shortener`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        };
        try {
            const response = await fetch(baseUrl, options);

            const data = await response.json();
            if (data.result_url) {
                setShortenedUrl(data.result_url);
                addToHistory(url, data.result_url);
            } else if (data.error) {
                handleError(data.error);
            }
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addToHistory = (oldUrl, newUrl) => {
        const date = new Date();
        const [dates, time] = [
            date.toLocaleDateString(),
            date.toLocaleTimeString(),
        ];
        const updatedUrl = {
            id: uuidv4(),
            oldUrl: oldUrl,
            newUrl: newUrl,
            date: dates,
            time: time,
            domain: oldUrl.split("/")[0],
        };

        if (isInHistory(updatedUrl)) {
            handleError("URL is already in history");
            setUrl("");
            return;
        }
        setPastUrls((prev) => [...prev, updatedUrl]);
    };

    const removeUrl = (id) => {
        setPastUrls((prevPastUrls) => prevPastUrls.filter((u) => u.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!url) {
            handleError("URL is required");
            return;
        }

        try {
            shortenUrl(url);
            setShortenedUrl("");
            setUrl("");
        } catch (error) {
            handleError(error.message);
        }
    };

    const handleInputChange = ({ target: { value } }) => setUrl(value);
    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    function handleError(error) {
        if (error) setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCurrentCopiedUrl(url);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };
    return (
        <div className="flex flex-col min-h-screen" data-theme={theme}>
            <main className="flex-grow flex flex-col items-center justify-between p-20">
                <ThemeToggle
                    theme={theme}
                    handleThemeChange={handleThemeChange}
                />

                <div className="flex flex-col m-auto z-10 w-full max-w-5xl items-center justify-center gap-12">
                    <h1 className="text-center text-6xl font-bold">
                        URL Shortener
                    </h1>
                    {error && (
                        <div role="alert" className="alert alert-error">
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

                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <label className="ml-6" htmlFor="url">
                            Enter URL
                        </label>
                        <div className="mt-1 join">
                            <input
                                className="rounded-l-full input input-bordered join-item"
                                id="url"
                                onChange={handleInputChange}
                                type="text"
                                name="url"
                                placeholder="http://google.com"
                                value={url}
                            />
                            <Button
                                loading={loading}
                                type="primary"
                                extra="join-item rounded-r-full"
                            >
                                <LuShrink size={24} />
                            </Button>
                        </div>
                    </form>
                    {loading && (
                        <span className="loading loading-spinner loading-xs size-10"></span>
                    )}
                    {shortenedUrl && (
                        <div className="card bg-base-200 text-base-content w-full md:w-4/5 lg:w-6/12">
                            <div className="card-body items-center text-center">
                                <h3 className="text-2xl font-bold">
                                    Shortened URL
                                </h3>
                                <div className="mt-5">
                                    <a
                                        className="text-blue-500 hover:text-blue-700"
                                        href={shortenedUrl}
                                        target="_blank"
                                    >
                                        {shortenedUrl}
                                    </a>
                                    <span
                                        className={`${
                                            isCopied &&
                                            currentCopiedUrl === url.newUrl &&
                                            "tooltip tooltip-open tooltip-top transition-all"
                                        }`}
                                        data-tip="copied"
                                    >
                                        <Button
                                            loading={loading}
                                            extra="ml-3 btn-square btn-ghost"
                                            onClick={() =>
                                                handleCopy(url.newUrl)
                                            }
                                        >
                                            <FaClipboardList size={20} />
                                        </Button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <History
                        pastUrls={pastUrls}
                        setPastUrls={setPastUrls}
                        loading={loading}
                        removeUrl={removeUrl}
                        isCopied={isCopied}
                        handleCopy={handleCopy}
                        currentCopiedUrl={currentCopiedUrl}
                    />
                </div>
            </main>
            <footer className="footer footer-center bg-base-300 text-base-content p-4">
                <aside>
                    <p>
                        Copyright © {new Date().getFullYear()} - All right
                        reserved by Anthony Duong
                    </p>
                </aside>
            </footer>
        </div>
    );
}
