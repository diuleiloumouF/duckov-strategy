import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: "class", // 关键：改为 class
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // ... 其他配置
}

export default config