'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export enum QuestType {
    LIST = 'list',
    GRAPH = 'graph',
}

export default function QuestControls() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();

    const searchTerm = searchParams.get('search') || '';
    const viewMode = (searchParams.get('view') as QuestType) || QuestType.LIST;

    const updateSearchParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => updateSearchParams('search', e.target.value)}
                    placeholder={t('quests.search_placeholder')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                    onClick={() => updateSearchParams('view', QuestType.LIST)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        viewMode === 'list'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {t('quests.list_view')}
                </button>
                <button
                    onClick={() => updateSearchParams('view', QuestType.GRAPH)}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
                        viewMode === QuestType.GRAPH
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={t('quests.graph_view')}
                >
                    {t('quests.graph_view')}
                </button>
            </div>
        </div>
    );
}