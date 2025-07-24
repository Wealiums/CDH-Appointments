'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import checkAuth from './checkAuth';

async function getBookingById(bookingId) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(
            sessionCookie.value
        );

        // Get user's ID for security check
        const { user } = await checkAuth();
        if (!user) {
            return null;
        }

        // Fetch the specific booking
        const booking = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        // Security check: Make sure the booking belongs to the current user
        if (booking.user_id !== user.id) {
            return null;
        }

        // Get room/accountant details
        if (booking.room_id) {
            try {
                const room = await databases.getDocument(
                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
                    booking.room_id
                );
                booking.room_id = room;
            } catch (error) {
                console.log('Could not fetch room details:', error);
                // Continue without room details
            }
        }

        return booking;
    } catch (error) {
        console.log('Failed to get booking', error);
        return null;
    }
}

export default getBookingById;
