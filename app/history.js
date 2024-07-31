import Button from "./components/Button";
import Link from "next/link";
import { FaClipboardList, FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";

export default function History({
    pastUrls,
    setPastUrls,
    loading,
    removeUrl,
    isCopied,
    currentCopiedUrl,
    handleCopy,
}) {
    const clearHistory = () => {
        setPastUrls([]);
    };

    return (
        <>
            {pastUrls?.length > 0 && (
                <div className="card card-bordered bg-base-200 text-base-content w-full">
                    <div className="card-body items-center text-center">
                        <h3 className="card-title text-2xl">History</h3>
                        <ul>
                            {pastUrls.map((url) => (
                                <li
                                    key={url.id}
                                    className="mt-3 flex items-center justify-between"
                                >
                                    {/* <span>
                                        {url.date} {url.time}
                                    </span> */}
                                    <div className="bg-base-300 p-4 mx-3 rounded-2xl">
                                        <Link
                                            className="text-blue-500 hover:text-blue-700"
                                            href={url.newUrl}
                                            target="_blank"
                                        >
                                            {url.newUrl}
                                        </Link>

                                        <span
                                            className={`${
                                                isCopied &&
                                                currentCopiedUrl ===
                                                    url.newUrl &&
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
                                        <Button
                                            type="error"
                                            loading={loading}
                                            extra="ml-3 btn-square btn-outline"
                                            onClick={() => removeUrl(url.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="card-actions justify-end">
                            <Button
                                type="error"
                                extra="mt-5"
                                onClick={clearHistory}
                            >
                                <FaRegTrashAlt size={20} />
                                Clear History
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
