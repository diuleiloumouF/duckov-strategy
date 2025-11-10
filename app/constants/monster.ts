import { Monster, MonsterData } from '@/app/types/monster';

// 获取怪物名称
export const getMonsterName = (masterData: MonsterData, nameKey: string): Monster | undefined => {
    const values = Object.values(masterData);

    return values.find(monster => monster.nameKey === nameKey)
}