import { v4 as uuidv4 } from "uuid";

export function isInHistory(pastUrls, newUrl) {
    return pastUrls.some((url) => url.oldUrl === newUrl.oldUrl);
}

export function addToHistory(
    oldUrl,
    newUrl,
    setPastUrls,
    handleError,
    setUrl,
    pastUrls
) {
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

    if (isInHistory(pastUrls, updatedUrl)) {
        handleError("URL is already in history");
        setUrl("");
        return;
    }
    setPastUrls((prev) => [...prev, updatedUrl]);
}

export async function shortenUrl(
    url,
    setShortenedUrl,
    handleError,
    addToHistoryCallback
) {
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
            addToHistoryCallback(url, data.result_url);
        } else if (data.error) {
            handleError(data.error);
        }
    } catch (error) {
        handleError(error.message);
    }
}
