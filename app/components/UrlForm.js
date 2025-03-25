import Button from "./Button";
import { LuShrink } from "react-icons/lu";

export default function UrlForm({ url, onUrlChange, onSubmit, loading }) {
    return (
        <form className="w-full" onSubmit={onSubmit}>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text text-lg">
                        Enter URL to shorten
                    </span>
                </label>
                <div className="join w-full">
                    <input
                        className="input input-bordered join-item w-full"
                        id="url"
                        onChange={onUrlChange}
                        type="text"
                        name="url"
                        placeholder="https://example.com"
                        value={url}
                    />
                    <Button loading={loading} type="primary" extra="join-item">
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <>
                                <LuShrink size={20} />
                                <span className="ml-2">Shorten</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
