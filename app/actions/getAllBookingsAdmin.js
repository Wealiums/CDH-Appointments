'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import checkAdmin from './checkAdmin';

async function getAllBookingsAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        // Check if user is admin
        const { isAdmin } = await checkAdmin();
        if (!isAdmin) {
            redirect('/');
        }

        const { databases } = await createSessionClient(
            sessionCookie.value
        );

        // Fetch ALL bookings (no user filter for admin)
        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS
        );

        // Get room details for each booking
        const bookingsWithRooms = await Promise.all(
            bookings.map(async (booking) => {
                try {
                    const room = await databases.getDocument(
                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
                        booking.room_id
                    );
                    return { ...booking, room_id: room };
                } catch (error) {
                    console.log('Could not fetch room details for booking:', booking.$id);
                    return booking;
                }
            })
        );

        // Get user details for each booking
        const bookingsWithDetails = await Promise.all(
            bookingsWithRooms.map(async (booking) => {
                try {
                    const { users } = await createSessionClient(sessionCookie.value);
                    const user = await users.get(booking.user_id);
                    return { ...booking, user_details: { name: user.name, email: user.email } };
                } catch (error) {
                    console.log('Could not fetch user details for booking:', booking.$id);
                    return { ...booking, user_details: { name: 'Unknown', email: 'unknown@example.com' } };
                }
            })
        );

        return bookingsWithDetails ?? [];
    } catch (error) {
        console.log('Failed to get all bookings', error);
        return [];
    }
}

export default getAllBookingsAdmin;
