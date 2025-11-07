import type {Metadata} from "next";
import Header from "./components/Header";
import "./globals.css";

// import {Geist, Geist_Mono} from "next/font/google";
// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "逃离鸭科夫: 指南",
    description: "你好鸭",
    // icons: {
    //     icon: "/icon.png"
    // }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased">
            <Header />
            {children}
        </body>
        </html>
    );
}
