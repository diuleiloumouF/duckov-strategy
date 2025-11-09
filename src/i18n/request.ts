import { getRequestConfig } from 'next-intl/server';
import { getLocale } from '@/app/actions/cookies';

export default getRequestConfig(async () => {
    const locale = await getLocale();

    return {
        locale: locale as string,
        messages: (await import(`../../public/locales/${locale}/common.json`)).default
    };
});
