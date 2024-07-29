"use client";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

export default function Home() {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [pastUrls, setPastUrls] = useState(() => {
        return JSON.parse(localStorage.getItem("pastUrls")) || [];
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUrls = JSON.parse(localStorage.getItem("pastUrls")) || [];
        setPastUrls(storedUrls);
    }, []);
    useEffect(() => {
        localStorage.setItem("pastUrls", JSON.stringify(pastUrls));
    }, [pastUrls]);

    function handleError(error) {
        if (error) setError(error);
        setTimeout(() => {
            setError(null);
        }, 5000);
    }

    function isInHistory(newUrl) {
        return pastUrls.some((url) => url.newUrl === newUrl.newUrl);
    }
    // each url will its domain displayed
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

    const addToHistory = (oldUrl, newUrl) => {
        const updatedUrl = {
            id: uuidv4(),
            oldUrl: oldUrl,
            newUrl: newUrl,
        };

        if (isInHistory(updatedUrl)) {
            handleError("URL is already in history");
            setUrl("");
            return;
        }
        setPastUrls([...pastUrls, updatedUrl]);
    };

    const removeUrl = (id) => {
        setPastUrls(pastUrls.filter((u) => u.id !== id));
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

    const handleChange = (e) => {
        setUrl(e.target.value);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-20">
            <div className="flex flex-col m-auto z-10 w-full max-w-5xl items-center justify-center gap-12">
                <h1 className="text-center text-5xl">URL Shortener</h1>
                {error && <div>{error}</div>}

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label className="ml-6" htmlFor="url">
                        Enter URL
                    </label>
                    <div className="mt-1">
                        <input
                            className="text-black rounded-l-full p-2"
                            id="url"
                            onChange={handleChange}
                            type="text"
                            name="url"
                            placeholder="http://google.com/"
                            value={url}
                        />
                        <button
                            className="bg-blue-500 rounded-r-full p-2 hover:bg-blue-700"
                            type="submit"
                        >
                            Shorten
                        </button>
                    </div>
                </form>
                {loading && <div>Loading...</div>}
                {pastUrls.length > 0 && (
                    <div className="rounded-lg bg-slate-900 p-3 w-full md:w-4/5 lg:w-6/12">
                        <h2 className="text-center text-2xl">History</h2>
                        <ul className="mt-5">
                            {pastUrls.map((url) => (
                                <li key={url.id} className="mt-3 text-center">
                                    <a
                                        className="text-blue-500 hover:text-blue-700"
                                        href={url.newUrl}
                                        target="_blank"
                                    >
                                        {url.newUrl}
                                    </a>
                                    <button
                                        className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                url.newUrl
                                            )
                                        }
                                    >
                                        Copy
                                    </button>
                                    <button
                                        className="ml-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => removeUrl(url.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
