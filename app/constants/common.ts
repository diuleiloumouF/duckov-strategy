export const LANG = [
    'chinesesimplified',
    'chinesetraditional',
    'japanese',
];

export const TAG_KEY = "Tags" as const;
export const CHARACTER_KEY = "Characters" as const;
export const ITEM_KEY = "Items" as const;

export type EnumKeys = typeof CHARACTER_KEY | typeof TAG_KEY | typeof ITEM_KEY;
