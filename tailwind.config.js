/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },
    plugins: [daisyui],
};
