import Button from "./components/Button";
import Link from "next/link";
import { FaClipboardList, FaRegTrashAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

export default function History({ pastUrls, setPastUrls, loading, removeUrl }) {
    const clearHistory = () => {
        setPastUrls([]);
    };

    if (!pastUrls?.length) return null;

    return (
        <div className="card bg-base-200 shadow-xl w-full">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h3 className="card-title text-xl">History</h3>
                    <Button
                        type="error"
                        loading={loading}
                        extra="btn-sm"
                        onClick={clearHistory}
                    >
                        <FaRegTrashAlt className="mr-2" />
                        Clear All
                    </Button>
                </div>
                <div className="divider"></div>
                <div className="space-y-4">
                    {pastUrls.map((url) => (
                        <div
                            key={url.id}
                            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="card-body p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="text-sm opacity-70 mb-1">
                                            {url.date} {url.time}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                            <Link
                                                className="link link-primary break-all"
                                                href={url.newUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {url.newUrl}
                                            </Link>
                                            <div className="flex gap-2">
                                                <Button
                                                    loading={loading}
                                                    extra="btn-sm btn-square"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            url.newUrl
                                                        )
                                                    }
                                                >
                                                    <FaClipboardList
                                                        size={16}
                                                    />
                                                </Button>
                                                <Button
                                                    type="error"
                                                    loading={loading}
                                                    extra="btn-sm btn-square"
                                                    onClick={() =>
                                                        removeUrl(url.id)
                                                    }
                                                >
                                                    <TiDelete size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
