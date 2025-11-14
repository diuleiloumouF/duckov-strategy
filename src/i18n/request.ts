import { getRequestConfig } from 'next-intl/server';
import { getLocale } from '@/app/actions/cookies';
import { BUFF_KEY, TAG_KEY } from '@/app/constants';
import { generateKeyValueFetch } from '@/app/utils/request';

const fetchBuffsLangs = generateKeyValueFetch(BUFF_KEY);
const fetchTagsLangs = generateKeyValueFetch(TAG_KEY);

export default getRequestConfig(async () => {
    const locale = await getLocale() || 'en';
    const locales = fetchBuffsLangs(locale);
    const tagLocales = fetchTagsLangs(locale);

    return {
        locale: locale as string,
        messages: {
            buffs: locales,
            tags: tagLocales,
            ...(await import(`../../public/locales/${locale}/common.json`)).default,
            ...(await import(`../../public/locales/${locale}/entry.json`)).default,
        }
    };
});
