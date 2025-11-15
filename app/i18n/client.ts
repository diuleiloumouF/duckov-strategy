import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import { defaultLanguage } from './config';
import { languages } from '@/app/constants';
import Backend from 'i18next-http-backend';


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