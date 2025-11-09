import { ReactNode } from 'react';

export type KeyValue = {
    [key: string]: string;
};

export type LocaleRouter = Readonly<{
    children?: ReactNode;
    params: Promise<{locale: string}>;
}>