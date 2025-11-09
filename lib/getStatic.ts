import { GetStaticPaths } from 'next';
import { Language, languageKeys } from '@/app/i18n/config';


export const getI18nPaths = () => languageKeys.map((lng) => ({
    params: {
        locale: lng,
    },
}));


// 动态路由，根据参数列表生成所有的页面
export const getStaticPaths = (async () => {
    return {
        paths: getI18nPaths(),
        fallback: false, // false or "blocking"
    }
}) satisfies GetStaticPaths

// 传入i18的参数
// export async function getI18nProps(
//     ctx: GetStaticPropsContext<LocaleParams>,
//     ns: string[] = ['common']
// ) {
//     const cookieLocale = await getLocale();
//     const locale = ctx?.params?.locale || cookieLocale || i18n.defaultLocale;
//     return {
//         ...(await serverSideTranslations(locale, ns)),
//     };
// }

// export function makeStaticProps(
//     ns: string[] = ['common']
// ): GetStaticProps<Record<string, unknown>, LocaleParams> {
//     return async function getStaticProps(
//         ctx: GetStaticPropsContext<LocaleParams>
//     ) {
//         return {
//             props: await getI18nProps(ctx, ns),
//         };
//     };
// }

export function generateStaticParams() {
    return languageKeys.map((lang) => ({
        locale: lang as Language,
    }))
}