import { MonsterData, Monster } from '@/app/types/monster';

export interface MonsterDropSource {
    monsterId: string;
    monster: Monster;
    chance: number;
    comment: string;
}

/**
 * Find all monsters that drop a specific item
 * @param itemId - The item type ID to search for
 * @param lootData - The monster loot data
 * @returns Array of monsters that drop this item with their drop chances
 */
export function findMonsterDropSources(
    itemId: number,
    lootData: MonsterData
): MonsterDropSource[] {
    const dropSources: MonsterDropSource[] = [];

    Object.entries(lootData).forEach(([monsterId, monster]) => {
        monster.itemsToGenerate?.forEach((drop) => {
            const hasItem = drop.itemPool.entries.some(
                (entry) => entry.value.itemTypeID === itemId
            );

            if (hasItem) {
                dropSources.push({
                    monsterId,
                    monster,
                    chance: drop.chance,
                    comment: drop.comment,
                });
            }
        });
    });

    return dropSources;
}