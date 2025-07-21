import { NextResponse } from 'next/server';
<<<<<<< HEAD

export async function middleware(request) {
    const isAuthenticated = true;
=======
import checkAuth from './app/actions/checkAuth';

export async function middleware(request) {
    const {isAuthenticated} = await checkAuth();
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/bookings'],
};  