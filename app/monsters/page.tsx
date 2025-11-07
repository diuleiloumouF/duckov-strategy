import MonsterCard from '@/app/components/MonsterCard';
import { MonsterData } from '@/app/types/monster';
import { Item } from '@/app/types/item';
import {fetchAllByFile, generateKeyValueFetch} from "@/app/utils/request";
import {CHARACTER_KEY, ITEM_KEY, LANG} from "@/app/constants";

const fetchCharacter = generateKeyValueFetch(CHARACTER_KEY);
const fetchItemI18 = generateKeyValueFetch(ITEM_KEY);

export default function MonstersPage() {
  // Load loot.json
  const lootData = fetchAllByFile<MonsterData>('loot.json');

  // Load items.json
  const items = fetchAllByFile<Item[]>('items.json');

  // Load language
  const langs = fetchCharacter(LANG[0]);
  const itemI18 = fetchItemI18(LANG[0]);

  // Convert monster data object to array
  const monsters = Object.entries(lootData).map(([key, monster]) => ({
    ...monster,
    key,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Monsters & Enemies
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total monsters: {monsters.length}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monsters.map((monster) => (
            <MonsterCard
              key={monster.key}
              monster={monster}
              items={items}
              monsterLangs={langs}
              itemsLangs={itemI18}
            />
          ))}
        </div>
      </main>
    </div>
  );
}