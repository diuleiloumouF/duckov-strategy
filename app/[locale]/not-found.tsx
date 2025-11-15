import { Metadata } from 'next';
import { LocaleLink } from '@/app/components/LocaleLink';
import { getLocale, getTranslations } from 'next-intl/server';
import { PageParamsProps } from '@/app/types/router';
import { Language } from '@/app/i18n/config';

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t('notfound.title'),
        description: t('notfound.message'),
    };
}

export default async function NotFound() {
    const lang = await getLocale();
    const t = await getTranslations({locale: lang});
    const locale = lang as Language;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <main className="max-w-2xl w-full text-center">
                {/* 404 Icon */}
                <div className="mb-8">
                    <div className="text-9xl font-bold text-gray-300 dark:text-gray-700">
                        404
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {t('notfound.heading')}
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    {t('notfound.message')}
                </p>

                {/* Navigation Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <LocaleLink
                        locale={locale}
                        href="/"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        {t('notfound.go_home')}
                    </LocaleLink>

                    <LocaleLink
                        href="/inventory"
                        locale={locale}
                        className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                    >
                        📦 {t('notfound.go_inventory')}
                    </LocaleLink>

                    <LocaleLink
                        href="/monsters"
                        locale={locale}
                        className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                    >
                        👾 {t('notfound.go_monsters')}
                    </LocaleLink>

                    <LocaleLink
                        href="/quests"
                        locale={locale}
                        className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                    >
                        📋 {t('notfound.go_quests')}
                    </LocaleLink>
                </div>

                {/* Illustration */}
                <div className="mt-12">
                    <div className="text-6xl opacity-20">🦆</div>
                </div>
            </main>
        </div>
    );
}