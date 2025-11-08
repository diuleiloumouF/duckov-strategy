import { Language } from '@/app/i18n/config';

export const parseLang = (lang: string) : Language => {
    const str = lang.toLowerCase();
    if (str.includes("en")) {
        return "en"
    } else if (str.includes("zh-tw")) {
        return "zh-TW"
    } else if (str.includes("jp")) {
        return "ja"
    }
    return "zh-CN"
}