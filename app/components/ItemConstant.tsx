import { AttributeItem, PrefabItem } from '@/app/types/item';
import React from 'react';
import { parseVariable } from '@/app/utils/format';
import {
    ItemVariable,
} from '@/app/[locale]/archived/types';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { isNumeric } from '@xyflow/system';

type ItemConstantProps = {} & PrefabItem;

export const ItemConstant: React.FC<ItemConstantProps> = async({ base }) => {
    const constans = base?.constants?.entries || [];
    const t = await getTranslations();
    return (
        <>
            {constans?.flatMap((constant) => {
                const value = parseVariable(constant as ItemVariable);
                if (!value) {
                    return undefined;
                }
                return (
                    <div
                        key={constant.key}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {t(`entry.${constant.key}`)}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {!isNumeric(value) ? value : Number(value).toFixed(2)}
                        </p>
                    </div>
                );
            })}
        </>
    );
};

export type ItemSlotsProps = {
    slots: string[];
};

export const ItemSlots: React.FC<ItemSlotsProps> = async ({ slots }) => {
    const t = await getTranslations();

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                { t('tags.Tag_Accessory')}
            </h2>
            <div className="grid grid-cols-6 gap-4">
                {slots.map((slot, idx) => {
                    const hasSlot = false;
                    return (
                        <div key={idx}>
                            <div
                                // locale={locale}
                                // href={`/inventory/${slotItem!.id}`}
                                key={idx}
                                className={`relative cursor-pointer transform transition-all duration-200 hover:scale-105`}
                            >
                                <div
                                    className={`border-t-red-50 border-2  relative rounded-2xl overflow-hidden aspect-square p-4`}
                                >
                                    {hasSlot ? (
                                        <>
                                            <div
                                                className={`flex h-full flex-col items-center justify-center `}
                                            >
                                                <Image
                                                    src={`/images/cross.webp`}
                                                    alt="cross"
                                                    loading="lazy"
                                                    width={64}
                                                    height={64}
                                                    className="object-contain"
                                                    style={{ transform: 'rotate(45deg)'  }}
                                                />
                                            </div>
                                            <div
                                                className={`text-[10px]  text-center right-0 dark:bg-black/50 p-1 absolute bottom-0`}
                                            >
                                                tttt
                                            </div>
                                        </>
                                    ) : (
                                        <>

                                            <div
                                                className={`flex h-full flex-col items-center justify-center `}
                                            >
                                                <Image
                                                    src={`/images/cross.webp`}
                                                    alt="cross"
                                                    loading="lazy"
                                                    width={64}
                                                    height={64}
                                                    className="object-contain"
                                                    style={{ transform: 'rotate(45deg)'  }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="px-4 py-2 border-slate-700">
                                    <p className="text-white text-sm  text-center">
                                        {t(`slot.accessories.${slot}`)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

type ItemAttributeProps = {
    attrs: AttributeItem[]
}

export const ItemAttribute: React.FC<ItemAttributeProps> = async ({ attrs }) => {
    const t = await getTranslations();

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                { t('inventory.properties')}
            </h2>
            <div className="grid grid-cols-6 gap-4">
                {attrs.map((attr) => {
                    return (
                        <div key={attr.key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm truncate text-gray-600 dark:text-gray-400 mb-1">
                                {t(`entry.${attr.key}`)}
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {attr.baseValue}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
