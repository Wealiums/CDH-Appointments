'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import checkAuth from './checkAuth';

async function cancelBooking(bookingId) {
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
            return {
                error: 'You must be logged in to cancel an appointment'
            }
        }

        // Get the appointment

        const booking = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        // Check if booking belongs to current user
        if (booking.user_id !== user.id) {
            return {
                error: 'You are not authorised to cancel this appointments'
            };
        }

        // Delete the booking
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        revalidatePath('/bookings', 'layout');

        return {
            success: true
        };

    } catch (error) {
        console.log('Failed to cancel appointment', error);
        return {
            error: 'Failed to cancel appointment'
        }
    }
}

export default cancelBooking;