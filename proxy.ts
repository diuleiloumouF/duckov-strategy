import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocale, setCookie } from '@/app/actions/cookies';
import { defaultLanguage, Language } from '@/app/i18n/config';
import { LANG_KEY } from '@/app/constants';
import { parseLang } from '@/app/utils/lang';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const langs = request.headers.get('accept-language') || defaultLanguage;
    const language = langs?.split(",")?.[0] as Language || defaultLanguage;
    let cookieLocale = await getLocale();
    if (decodeURIComponent(cookieLocale).indexOf(",") >= 0 || !cookieLocale) {
        cookieLocale = parseLang(language);
    }
    await setCookie(LANG_KEY, cookieLocale);
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
    ]
}