import { Language } from '@/app/i18n/config';

export type PageParams = Promise<{ locale: Language }>
export type PageParamsProps = {
    params: PageParams
}