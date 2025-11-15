import { MetadataRoute } from 'next';
import { fetchAllByFile } from '@/app/utils/request';
import { Item } from '@/app/types/item';
import { defaultLanguage, languageKeys } from '@/app/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const items = fetchAllByFile<Item[]>('items.json');


    const sitemap: MetadataRoute.Sitemap = [];

    languageKeys.forEach((locale) => {
        const localePrefix = `/${locale}`;

        sitemap.push(
            {
                url: `${baseUrl}${localePrefix}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
                // 添加多语言标记
                alternates: {
                    languages: Object.fromEntries(
                        languageKeys.map(l => [l, `${baseUrl}${l === defaultLanguage ? '' : `/${l}`}`])
                    ),
                },
            },
            {
                url: `${baseUrl}${localePrefix}/inventory`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
                alternates: {
                    languages: Object.fromEntries(
                        languageKeys.map(l => [l, `${baseUrl}${l === defaultLanguage ? '' : `/${l}`}/inventory`])
                    ),
                },
            },
            {
                url: `${baseUrl}${localePrefix}/monsters`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}${localePrefix}/quests`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }
        );

        // 为每个语言生成动态 item 页面
        items.forEach((item) => {
            sitemap.push({
                url: `${baseUrl}${localePrefix}/inventory/${item.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        });
    });

    return sitemap;
}