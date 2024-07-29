import Button from "./components/Button";
import Link from "next/link";
export default function History({ pastUrls, setPastUrls, loading, removeUrl }) {
    const clearHistory = () => {
        setPastUrls([]);
    };

    return (
        <>
            {pastUrls?.length > 0 && (
                <div className="card card-bordered bg-base-200 text-base-content w-full">
                    <div className="card-body items-center text-center">
                        <h3 className="card-title text-2xl">History</h3>
                        <ul className="mt-5">
                            {pastUrls.map((url) => (
                                <li key={url.id} className="mt-3">
                                    <span>
                                        {url.date} {url.time}
                                    </span>
                                    <Link
                                        className="text-blue-500 hover:text-blue-700 mx-3"
                                        href={url.newUrl}
                                        target="_blank"
                                    >
                                        {url.newUrl}
                                    </Link>

                                    <Button
                                        type="primary"
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
                                        type="error"
                                        loading={loading}
                                        onClick={() => removeUrl(url.id)}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <div className="card-actions justify-end">
                            <Button
                                type="error"
                                extra="mt-5"
                                onClick={clearHistory}
                            >
                                Clear History
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
