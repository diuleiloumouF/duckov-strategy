import { ReactNode } from 'react';
import { PageParams } from '@/app/types/router';

export type KeyValue = {
    [key: string]: string;
};

export type LocaleRouter = Readonly<{
    children?: ReactNode;
    params: PageParams;
}>