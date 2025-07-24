'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import checkAdmin from './checkAdmin';

async function cancelBookingAdmin(bookingId) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        // Check if user is admin
        const { isAdmin } = await checkAdmin();
        if (!isAdmin) {
            return { error: 'Unauthorized: Admin access required' };
        }

        const { databases } = await createSessionClient(
            sessionCookie.value
        );

        // Delete the booking
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );

        // Revalidate the admin page
        revalidatePath('/admin/bookings', 'layout');

        return { success: true };
    } catch (error) {
        console.log('Failed to cancel booking', error);
        return { error: 'Failed to cancel booking' };
    }
}

export default cancelBookingAdmin;
