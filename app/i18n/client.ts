import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import { defaultLanguage, type Language } from './config';
import { getCookies, setCookie } from '@/app/actions/cookies';
import { LANG_KEY, languages } from '@/app/constants';
import Backend from 'i18next-http-backend';

// const runsOnServerSide = typeof window === 'undefined';

// https://react.i18next.com/latest/i18nextprovider
// https://github.com/i18next/react-i18next/blob/master/example/react-component-lib/src/i18n.js

// Initialize i18next
i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
        lng: defaultLanguage,
        fallbackLng: defaultLanguage,
        supportedLngs: Object.keys(languages),
        defaultNS: 'common',
        fallbackNS: 'common',
        ns: ['common'],
        // preload: runsOnServerSide ? Object.keys(languages) : [],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            // 默认会缓存到这些地方
            caches: ['localStorage', 'cookie'],
            // Cookie 相关配置
            cookieMinutes: 525600, // 365天，默认值
            // cookieDomain: 'myDomain', // cookie 域名
            cookiePath: '/', // cookie 路径
            cookieSameSite: 'strict', // SameSite 属性
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;


// i18n.on('languageChanged', async (lang) => {
//     console.log('i18程序触发change', lang);
//     await changeLanguage(lang as Language);
// });

export async function changeLanguage(lang: Language) {
    if (i18n.language !== lang) {
        await i18n.changeLanguage(lang);
        await setCookie(LANG_KEY, lang);
    }
}

export async function getStoredLanguage(): Promise<Language> {
    const defaultLang = await getCookies(LANG_KEY) || defaultLanguage;
    return defaultLang as Language;
}