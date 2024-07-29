"use client";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import Link from "next/link";

const Button = ({ children, onClick, loading, btnClass }) => {
    return (
        <button className={btnClass} onClick={onClick} disabled={loading}>
            {children}
        </button>
    );
};

export default function Home() {
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [pastUrls, setPastUrls] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedPastUrls = JSON.parse(localStorage.getItem("pastUrls"));
        if (storedPastUrls) {
            setPastUrls((prev) => [...prev, ...storedPastUrls]);
        }
    }, []);

    useEffect(() => {
        function storeLocalstorage() {
            try {
                localStorage.setItem("pastUrls", JSON.stringify(pastUrls));
            } catch (error) {
                console.error("Error storing data in localStorage:", error);
            }
        }

        storeLocalstorage();
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

    const handleChange = ({ target: { value } }) => setUrl(value);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-20">
            <div className="flex flex-col m-auto z-10 w-full max-w-5xl items-center justify-center gap-12">
                <h1 className="text-center text-6xl font-bold">
                    URL Shortener
                </h1>
                {error && <div>{error}</div>}

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
                            btnClass="btn btn-primary join-item rounded-r-full"
                        >
                            Shorten
                        </Button>
                    </div>
                </form>
                {shortenedUrl && (
                    <div className="rounded-lg bg-base-200 p-5 w-full md:w-4/5 lg:w-6/12 text-center">
                        <h3 className="text-2xl">Shortened URL</h3>
                        <a
                            className="text-blue-500 hover:text-blue-700"
                            href={shortenedUrl}
                            target="_blank"
                        >
                            {shortenedUrl}
                        </a>
                        <Button
                            btnClass="ml-3 btn btn-primary"
                            loading={loading}
                            onClick={() =>
                                navigator.clipboard.writeText(shortenedUrl)
                            }
                        >
                            Copy
                        </Button>
                    </div>
                )}
                {pastUrls.length > 0 && (
                    <div
                        className={`overflow-auto ${
                            pastUrls.length > 5 ? "h-96" : ""
                        } rounded-lg bg-base-200 p-5 w-full md:w-4/5 lg:w-6/12 text-center`}
                    >
                        <h3 className="text-2xl">History</h3>
                        <ul className="mt-5">
                            {pastUrls.map((url) => (
                                <li key={url.id} className="mt-3 text-center">
                                    <Link
                                        className="text-blue-500 hover:text-blue-700"
                                        href={url.newUrl}
                                        target="_blank"
                                    >
                                        {url.newUrl}
                                    </Link>
                                    <Button
                                        btnClass="ml-3 btn btn-primary"
                                        loading={loading}
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                url.newUrl
                                            )
                                        }
                                    >
                                        Copy
                                    </Button>
                                    <Button
                                        btnClass="ml-3 btn btn-error"
                                        loading={loading}
                                        onClick={() => removeUrl(url.id)}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
