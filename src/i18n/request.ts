import { getRequestConfig } from 'next-intl/server';
import { BUFF_KEY, CHARACTER_KEY, ITEM_KEY, TAG_KEY } from '@/app/constants';
import { generateKeyValueFetch } from '@/app/utils/request';
import { defaultLanguage, Language, languageKeys } from '@/app/i18n/config';
import { notFound } from 'next/navigation';

const fetchBuffsLangs = generateKeyValueFetch(BUFF_KEY);
const fetchTagsLangs = generateKeyValueFetch(TAG_KEY);
const fetchItemI18 = generateKeyValueFetch(ITEM_KEY);
const fetchCharacterI18 = generateKeyValueFetch(CHARACTER_KEY);

export default getRequestConfig(async ({ locale  }) => {

    // 处理非国际化路径（sitemap, robots, api 等）
    if (!locale) {
        return {
            locale: defaultLanguage,
            messages: {},
            timeZone: 'Asia/Shanghai',
            now: new Date(),
        };
    }

    if (!languageKeys.includes(locale as Language)) {
        notFound();
    }

    const lang = locale as Language;

    const locales = fetchBuffsLangs(lang);
    const tagLocales = fetchTagsLangs(lang);
    const itemLocales = fetchItemI18(lang);
    const monstersLocales = fetchCharacterI18(lang);

    return {
        locale: lang as string,
        messages: {
            buffs: locales,
            tags: tagLocales,
            items: itemLocales,
            characters: monstersLocales,
            ...(await import(`../locales/${lang}/common.json`)).default,
            ...(await import(`../locales/${lang}/entry.json`)).default,
        }
    };
});
