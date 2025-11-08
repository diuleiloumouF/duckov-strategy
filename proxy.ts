import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLocale, setCookie } from '@/app/actions/cookies';
import { defaultLanguage } from '@/app/i18n/config';
import { LANG_KEY } from '@/app/constants';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const language = request.headers.get('accept-language') || defaultLanguage;
    const cookieLocale = await getLocale();
    await setCookie(LANG_KEY, cookieLocale || language);

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}