import type { Metadata } from 'next';
import Header from '../components/Header';
import '../globals.css';
import { getLocale } from '../actions/cookies';
import {NextIntlClientProvider} from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Language } from '@/app/i18n/config';
import { generateStaticParams } from '@/lib/getStatic';

import {Geist, Geist_Mono} from "next/font/google";
import { LocaleRouter } from '@/app/types/global';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const localeMap: Record<string, string> = {
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
    'ja': 'ja_JP',
    'en': 'en_US',
};

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    const locale = await getLocale();
    const ogLocale = localeMap[locale] || 'zh_CN';
    const siteName = t('seo.site_name');
    const siteDescription = t('seo.site_description');
    const keywords = t('seo.keywords').split(',');

    return {
        title: {
            default: siteName,
            template: `%s | ${siteName}`,
        },
        description: siteDescription,
        keywords,
        authors: [{ name: 'BeSmile' }],
        creator: 'https://github.com/BeSmile/',
        publisher: 'https://github.com/BeSmile/',
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        ),
        alternates: {
            canonical: '/',
            languages: {
                'zh-CN': '/zh-CN',
                'zh-TW': '/zh-TW',
                'ja': '/ja',
                'en': '/en',
            },
        },
        openGraph: {
            type: 'website',
            locale: ogLocale,
            alternateLocale: Object.values(localeMap).filter(
                (l) => l !== ogLocale
            ),
            url: '/',
            siteName,
            title: siteName,
            description: siteDescription,
            images: [
                {
                    url: '/icon.png',
                    width: 1200,
                    height: 630,
                    alt: siteName,
                },
            ],
        },
        // twitter: {
        //     card: 'summary_large_image',
        //     title: siteName,
        //     description: siteDescription,
        //     images: ['/twitter-image.jpg'],
        // },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            // google: 'your-google-verification-code', // 需要时添加
            // yandex: 'your-yandex-verification-code',
            // bing: 'your-bing-verification-code',
        },
        // icons: {
        //     icon: "/icon.png"
        // }
    };
}

export default async function RootLayout({
    children,
    params
}: Readonly<LocaleRouter>) {
    const { locale } = await params;

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NextIntlClientProvider>
                    <Header locale={locale as Language}/>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export { generateStaticParams }

export const dynamicParams = false; // 添加这个