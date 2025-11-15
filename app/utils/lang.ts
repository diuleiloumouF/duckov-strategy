import { Language } from '@/app/i18n/config';
import { getTranslations } from 'next-intl/server';

export const parseLang = (lang: string) : Language => {
    const str = lang.toLowerCase();
    if (str.includes("en")) {
        return "en"
    } else if (str.includes("zh-tw")) {
        return "zh-TW"
    } else if (str.includes("jp")) {
        return "ja"
    }
    return "zh-CN"
}

export type TrFn = Awaited<ReturnType<typeof getTranslations>>;


// 获取Name
export function getName<T extends object>(
    t: TrFn,
    item: T,
    options: {
        primaryKey: keyof T;
        callbackKey: keyof T;
        key: string;
    }
): string{
    const tKey = `${options.key}.${String(item[options.primaryKey])}`;
    // 使用更清晰的条件判断
    return t.has(tKey) ? t(tKey) : item[options.callbackKey] as string;
}


// 直接获取Item中的物品
export function getItemKey<T extends object>(
    t: TrFn,
    item: T,
    langKey: keyof T
) {
    return getName(t, item, {
        key: "items",
        primaryKey: langKey,
        callbackKey: langKey,
    })
}

// 通过Key获取怪物字段
export function getMonsterKey<T extends object>(
    t: TrFn,
    item: T,
    langKey: keyof T
) {
    return getName(t, item, {
        key: "monsters",
        primaryKey: langKey,
        callbackKey: langKey,
    })
}

export function getItemName<T extends object>(
    t: TrFn,
    item: T,
) {
    return getName(t, item, {
        key: "items",
        primaryKey: 'displayName' as keyof T,
        callbackKey: 'name' as keyof T,
    })
}

// 获取怪物的名称
export function getMonsterName<T extends object>(
    t: TrFn,
    item: T,
) {
    return getName(t, item, {
        key: "characters",
        primaryKey: 'nameKey' as keyof T,
        callbackKey: 'm_Name' as keyof T,
    })
}

