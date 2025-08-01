'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from "next/navigation";
import checkAuth from './checkAuth';

async function getMyBookings() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(
            sessionCookie.value
        );

        // Get user's ID
        const { user } = await checkAuth();

        if (!user) {
            return [];
        }

        // Fetch users bookings
        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('user_id', user.id)]
        );

        return bookings ?? [];
    } catch (error) {
        console.log('Failed to get users appointments', error);
        return [];
    }
}

export default getMyBookings;