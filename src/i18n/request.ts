import { getRequestConfig } from 'next-intl/server';
import { BUFF_KEY, CHARACTER_KEY, ITEM_KEY, TAG_KEY } from '@/app/constants';
import { generateKeyValueFetch } from '@/app/utils/request';
import { Language } from '@/app/i18n/config';

const fetchBuffsLangs = generateKeyValueFetch(BUFF_KEY);
const fetchTagsLangs = generateKeyValueFetch(TAG_KEY);
const fetchItemI18 = generateKeyValueFetch(ITEM_KEY);
const fetchCharacterI18 = generateKeyValueFetch(CHARACTER_KEY);

export default getRequestConfig(async ({ locale  }) => {

    const lang = (locale||'en') as Language;

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
