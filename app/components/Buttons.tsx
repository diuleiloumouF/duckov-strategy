'use client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const GoBack = () => {
    const router = useRouter();
    const t = useTranslations();
    return (
        <Link
            href="#"
            onClick={(e) => {
                e.preventDefault();
                router.back();
            }}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
            ← {t('button.back')}
        </Link>
    )
}