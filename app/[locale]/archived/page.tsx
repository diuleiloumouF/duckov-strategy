import { PageParamsProps } from '@/app/types/router';
import ArchiveUpload from '@/app/components/ArchiveUpload';
import { fetchAllByFile, generateKeyValueFetch } from '@/app/utils/request';
import { Item } from '@/app/types/item';
import { MonsterData } from '@/app/types/monster';
import { CHARACTER_KEY, ITEM_KEY } from '@/app/constants';
import { IQuestGraph } from '@/app/types/quest';

type ArchivedProps = PageParamsProps

const fetchItemI18 = generateKeyValueFetch(ITEM_KEY);
const fetchCharacterI18 = generateKeyValueFetch(CHARACTER_KEY);

export default async function Archived({ params }: ArchivedProps) {

    const { locale } = await params;
    const items = fetchAllByFile<Item[]>('items.json');// 获取物品
    const monsterData = fetchAllByFile<MonsterData>('loot.json');// 获取怪物信息
    const itemsLangs = fetchItemI18(locale);
    const monstersLangs = fetchCharacterI18(locale);
    const questData = fetchAllByFile<IQuestGraph>('quest.json');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <main className="max-w-7xl mx-auto">
                <ArchiveUpload questData={questData} monstersLangs={monstersLangs} monsters={monsterData} items={items} locale={locale} itemsLangs={itemsLangs}/>
            </main>
        </div>
    )
}