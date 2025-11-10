// 物品稀有度配置 - 参考三角洲行动
export interface QualityConfig {
    level: number;
    name: string;
    nameKey: string; // i18n key
    color: string; // Tailwind color class
    bgColor: string; // Background color
    borderColor: string; // Border color
    textColor: string; // Text color
}

export const QUALITY_CONFIGS: Record<number, QualityConfig> = {
    0: {
        level: 0,
        name: 'Common',
        nameKey: 'quality.common',
        color: 'gray',
        bgColor: 'bg-gray-200 dark:bg-gray-800',
        borderColor: 'border-gray-300 dark:border-gray-600',
        textColor: 'text-gray-700 dark:text-gray-300',
    },
    1: {
        level: 1,
        name: 'Common',
        nameKey: 'quality.common',
        color: 'gray',
        bgColor: 'bg-gray-200 dark:bg-gray-800',
        borderColor: 'border-gray-300 dark:border-gray-600',
        textColor: 'text-gray-700 dark:text-gray-300',
    },
    2: {
        level: 2,
        name: 'Uncommon',
        nameKey: 'quality.uncommon',
        color: 'green',
        bgColor: 'bg-green-200 dark:bg-green-900',
        borderColor: 'border-green-400 dark:border-green-500',
        textColor: 'text-green-700 dark:text-green-300',
    },
    3: {
        level: 3,
        name: 'Rare',
        nameKey: 'quality.rare',
        color: 'blue',
        bgColor: 'bg-blue-200 dark:bg-blue-900',
        borderColor: 'border-blue-400 dark:border-blue-500',
        textColor: 'text-blue-700 dark:text-blue-300',
    },
    4: {

        level: 4,
        name: 'Epic',
        nameKey: 'quality.epic',
        color: 'purple',
        bgColor: 'bg-purple-200 dark:bg-purple-900',
        borderColor: 'border-purple-400 dark:border-purple-500',
        textColor: 'text-purple-700 dark:text-purple-300',
    },
    5: {
        level: 5,
        name: 'Legendary',
        nameKey: 'quality.legendary',
        color: 'orange',
        bgColor: 'bg-orange-200 dark:bg-orange-900',
        borderColor: 'border-orange-400 dark:border-orange-500',
        textColor: 'text-orange-700 dark:text-orange-300',
    },
    // 特殊 - 预留（彩虹色）
    6: {
        level: 6,
        name: 'Mythic',
        nameKey: 'quality.mythic',
        color: 'red',
        bgColor: 'bg-red-200 dark:bg-red-900',
        borderColor: 'border-red-400 dark:border-red-500',
        textColor: 'text-red-700 dark:text-red-300',
    },
};

// 默认配置（灰色）- 用于 999 及其他特殊值
export const DEFAULT_QUALITY_CONFIG: QualityConfig = {
    level: 999,
    name: 'System',
    nameKey: 'quality.system',
    color: 'gray',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-500 dark:text-gray-400',
};

/**
 * 获取物品稀有度配置
 * @param quality 物品稀有度等级
 * @returns 稀有度配置
 */
export function getQualityConfig(quality: number): QualityConfig {
    // 0-6 使用正常配置
    if (quality >= 0 && quality <= 6) {
        return QUALITY_CONFIGS[quality];
    }
    // 其他值使用默认配置
    return DEFAULT_QUALITY_CONFIG;
}

/**
 * 获取稀有度显示文字的颜色类名
 * @param quality 物品稀有度等级
 * @returns Tailwind 颜色类名
 */
export function getQualityTextColor(quality: number): string {
    return getQualityConfig(quality).textColor;
}

/**
 * 获取稀有度边框颜色类名
 * @param quality 物品稀有度等级
 * @returns Tailwind 边框颜色类名
 */
export function getQualityBorderColor(quality: number): string {
    return getQualityConfig(quality).borderColor;
}

/**
 * 获取稀有度背景颜色类名
 * @param quality 物品稀有度等级
 * @returns Tailwind 背景颜色类名
 */
export function getQualityBgColor(quality: number): string {
    return getQualityConfig(quality).bgColor;
}