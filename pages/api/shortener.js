import axios from "axios";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        try {
            const response = await axios.post(
                "https://cleanuri.com/api/v1/shorten",
                `url=${encodeURIComponent(url)}`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            res.status(200).json(response.data);
        } catch (error) {
            console.error(
                "Error shortening URL:",
                error.response ? error.response.data : error.message
            );
            res.status(500).json({ error: "Failed to shorten URL" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
