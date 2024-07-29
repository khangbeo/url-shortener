export default function handler(req, res) {
    console.log("Hello from the backend!");
    res.status(200).json({ message: "Hello from the backend!" });
}
