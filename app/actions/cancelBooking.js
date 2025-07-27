'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import checkAuth from './checkAuth';
import checkAdmin from './checkAdmin';

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

        // Get user's ID and admin status
        const { user } = await checkAuth();
        const { isAdmin } = await checkAdmin();

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

        // Allow if admin, or if booking belongs to current user
        if (!isAdmin && booking.user_id !== user.id) {
            return {
                error: 'You are not authorised to cancel this appointment'
            };
        }

        // Delete the booking
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        // Revalidate both user and admin bookings pages
        revalidatePath('/bookings', 'layout');
        revalidatePath('/admin', 'layout');

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