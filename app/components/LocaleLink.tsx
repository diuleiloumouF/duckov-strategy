import Link, { LinkProps } from 'next/link';
import React, { ReactNode } from 'react';
import { Language } from '@/app/i18n/config';

type LocaleLinkProps = LinkProps  &{
    children: ReactNode;
    className?: string;
    locale: Language;
}

export const  LocaleLink: React.FC<LocaleLinkProps> = ({ children, locale, href, ...props }) => {
    return <Link href={`/${locale}${href}`} {...props}>{children}</Link>;
};