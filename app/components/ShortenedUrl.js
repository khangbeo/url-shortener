import Button from "./Button";

export default function ShortenedUrl({ url, loading }) {
    return (
        <div className="card bg-base-200 shadow-xl w-full">
            <div className="card-body">
                <h3 className="card-title text-xl">Shortened URL</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                    <a
                        className="link link-primary break-all"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {url}
                    </a>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={() => navigator.clipboard.writeText(url)}
                    >
                        Copy
                    </Button>
                </div>
            </div>
        </div>
    );
}
