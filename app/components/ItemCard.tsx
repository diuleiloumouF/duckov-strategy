import Image from 'next/image';
import Link from 'next/link';
import { Item, KeyValue } from '../types/item';

interface ItemCardProps {
    item: Item;
    langs: KeyValue;
    tags: KeyValue;
}

export const getName = (langs: KeyValue, item: Item) => {
    return langs?.[item.displayName] || item.name;
};

export default function ItemCard({ item, langs, tags }: ItemCardProps) {
    const cnTag = item.tags.map((tag) => tags?.[`Tag_${tag}`] || tag);
    return (
        <Link href={`/inventory/${item.id}`} className="block">
            <div className="border flex-1/6 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow dark:border-gray-700 h-[280px] flex flex-col hover:border-blue-400 dark:hover:border-blue-500">
                <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded">
                        <Image
                            src={`/images/${item.icon}`}
                            alt={item.displayName}
                            fill
                            loading="lazy"
                            className="object-contain"
                            sizes="64px"
                            // onError={(e) => {
                            //   const target = e.target as HTMLImageElement;
                            //   target.src = '/placeholder.png';
                            // }}
                        />
                    </div>
                    <div className="text-center w-full flex-shrink-0">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                            {getName(langs, item)}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            ID: {item.id}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 h-8">
                            {langs?.[item.description] || item.description}
                        </p>
                    </div>
                    <div className="flex justify-between w-full text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2 flex-shrink-0">
                        <span>Price: {item.priceEach}</span>
                        <span>Stack: {item.maxStackCount}</span>
                    </div>
                    <div className="w-full flex-1 overflow-y-auto min-h-0">
                        <div className="flex flex-wrap gap-1">
                            {cnTag.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium whitespace-nowrap"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
