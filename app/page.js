"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Button from "./components/Button";
import History from "./history";

export default function Home() {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [pastUrls, setPastUrls] = useLocalStorage("pastUrls", []);
    const [theme, setTheme] = useLocalStorage("theme", "");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleError(error) {
        if (error) setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    function isInHistory(newUrl) {
        return pastUrls.some((url) => url.oldUrl === newUrl.oldUrl);
    }

    const shortenUrl = async (url) => {
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
        }
    };
    // get date and time from new Date().toLocaleDateString()

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

        setLoading(true);
        shortenUrl(url);
        setLoading(false);
        setShortenedUrl("");
        setUrl("");
    };

    console.log(theme);
    const handleChange = ({ target: { value } }) => setUrl(value);
    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    return (
        <div className="flex flex-col min-h-screen" data-theme={theme}>
            <main className="flex-grow flex flex-col items-center justify-between p-20">
                <label className="swap swap-rotate  fixed right-4 top-4 z-50">
                    {/* this hidden checkbox controls the state */}
                    <input
                        type="checkbox"
                        className="theme-controller"
                        value={theme}
                        onChange={handleThemeChange}
                    />

                    {/* sun icon */}
                    <svg
                        className="swap-off h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>

                    {/* moon icon */}
                    <svg
                        className="swap-on h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>

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
                                onChange={handleChange}
                                type="text"
                                name="url"
                                placeholder="http://google.com/"
                                value={url}
                            />
                            <Button
                                loading={loading}
                                type="primary"
                                extra="join-item rounded-r-full"
                            >
                                Shorten
                            </Button>
                        </div>
                    </form>
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
                                    <Button
                                        type="primary"
                                        loading={loading}
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                shortenedUrl
                                            )
                                        }
                                    >
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <History
                        pastUrls={pastUrls}
                        removeUrl={removeUrl}
                        loading={loading}
                        setPastUrls={setPastUrls}
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
