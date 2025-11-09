import ItemCard from '@/app/components/ItemCard';
import Pagination from '@/app/components/Pagination';
import SearchFilter from '@/app/components/SearchFilter';
import { Item } from '@/app/types/item';
import { fetchAllByFile, generateKeyValueFetch } from '@/app/utils/request';
import { ITEM_KEY, TAG_KEY } from '@/app/constants';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Language } from '@/app/i18n/config';
import { PageParams } from '@/app/types/router';

const ITEMS_PER_PAGE = 20; // 分页

const fetchTags = generateKeyValueFetch(TAG_KEY);
const fetchItemI18 = generateKeyValueFetch(ITEM_KEY);

interface HomeProps {
    searchParams: Promise<{ page?: string; search?: string; tags?: string }>;
    params: PageParams;
}

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
    const t = await getTranslations();
    const params = await searchParams;
    const allData = fetchAllByFile<Item[]>('items.json');
    const itemsCount = allData.length;
    const currentPage = Number(params.page) || 1;
    const searchTerm = params.search || '';
    const selectedTags = params.tags?.split(',').filter(Boolean) || [];

    let title = t('seo.inventory_title');
    let description = t('seo.inventory_description', {
        count: itemsCount.toString(),
    });

    if (searchTerm) {
        title = t('seo.inventory_search_title', { term: searchTerm });
        description = t('seo.inventory_search_description', {
            term: searchTerm,
        });
    } else if (selectedTags.length > 0) {
        const tagsStr = selectedTags.join(', ');
        title = t('seo.inventory_filter_title', { tags: tagsStr });
        description = t('seo.inventory_filter_description', {
            tags: tagsStr,
        });
    } else if (currentPage > 1) {
        title = t('seo.inventory_page_title', {
            page: currentPage.toString(),
        });
    }

    const keywords = (t('seo.inventory_keywords')).split(',');

    return {
        title,
        description,
        keywords,
        openGraph: {
            title: `${title} | ${t('seo.site_name')}`,
            description,
            type: 'website',
        },
    };
}

export default async function Home({ searchParams, params }: HomeProps) {
    const sParams = await searchParams;
    const localParams = await params;
    const locale = localParams?.locale as Language;
    const currentPage = Number(sParams.page) || 1;
    const searchTerm = sParams.search?.toLowerCase() || '';
    const selectedTags = sParams.tags?.split(',').filter(Boolean) || [];
    const t = await getTranslations();

    // Fetch all data
    const allData = fetchAllByFile<Item[]>('items.json');
    const langs = fetchItemI18(locale);
    const tags = fetchTags(locale);

    // Prepare quality translations
    const qualityTranslations = {
        'quality.common': t('quality.common'),
        'quality.uncommon': t('quality.uncommon'),
        'quality.rare': t('quality.rare'),
        'quality.epic': t('quality.epic'),
        'quality.legendary': t('quality.legendary'),
        'quality.mythic': t('quality.mythic'),
        'quality.special': t('quality.special'),
        'quality.system': t('quality.system'),
    };

    // Collect all unique tags for filter dropdown
    const allUniqueTags = Array.from(
        new Set(
            allData.flatMap((item) =>
                item.tags.map((tag) => tags?.[`Tag_${tag}`] || tag)
            )
        )
    ).sort();

    // Filter data based on search and tags
    let filteredData = allData;

    // Apply search filter
    if (searchTerm) {
        filteredData = filteredData.filter((item) => {
            const itemId = item.id.toString();
            const itemName = item.name.toLowerCase();
            const itemDisplayName = (
                langs?.[item.displayName] || ''
            ).toLowerCase();

            return (
                itemId.includes(searchTerm) ||
                itemName.includes(searchTerm) ||
                itemDisplayName.includes(searchTerm)
            );
        });
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
        filteredData = filteredData.filter((item) => {
            const itemTags = item.tags.map(
                (tag) => tags?.[`Tag_${tag}`] || tag
            );
            return selectedTags.every((selectedTag) =>
                itemTags.includes(selectedTag)
            );
        });
    }

    // Calculate pagination on filtered data
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Ensure current page is within valid range
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    // Get items for current page
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <main className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {t('inventory.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('common.total')}: {allData.length} {t('inventory.items')}
                        {totalItems !== allData.length &&
                            ` | ${t('common.filtered')}: ${totalItems} ${t('inventory.items')}`}
                        {totalItems > 0 &&
                            ` | ${t('common.page')} ${validPage} ${t('common.of')} ${totalPages}`}
                    </p>
                </div>

                {/* Search and Filter */}
                <Suspense
                    fallback={
                        <div className="mb-6 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    }
                >
                    <SearchFilter allTags={allUniqueTags} />
                </Suspense>

                {/* Results */}
                {paginatedData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {paginatedData.map((item: Item) => (
                                <ItemCard
                                    locale={locale}
                                    tags={tags}
                                    langs={langs}
                                    item={item}
                                    qualityTranslations={qualityTranslations}
                                    key={item.id}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Suspense
                                fallback={
                                    <div className="mt-8 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                }
                            >
                                <Pagination
                                    currentPage={validPage}
                                    totalPages={totalPages}
                                    baseUrl="/inventory"
                                />
                            </Suspense>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                            {t('inventory.no_results')}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            {t('inventory.try_adjust_filters')}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
