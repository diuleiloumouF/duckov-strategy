import { LinkProps } from 'next/link';
import { Link } from '@/app/i18n/navigation';
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
    // console.log(href, locale, href);
    return <Link href={href} locale={locale} {...props}>{children}</Link>;
};