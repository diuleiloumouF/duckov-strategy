import Link, { LinkProps } from 'next/link';
import React, { HTMLProps, ReactNode } from 'react';
import { Language } from '@/app/i18n/config';

type LocaleLinkProps = LinkProps  &{
    children: ReactNode;
    className?: string;
    locale: Language;
}

export const  LocaleLink: React.FC<LocaleLinkProps> = ({ children, locale, href, ...props }) => {
    if (!href){
        return <div {...(props as HTMLProps<HTMLDivElement>)}>{children}</div>
    }
    return <Link href={`/${locale}${href}`} {...props}>{children}</Link>;
};