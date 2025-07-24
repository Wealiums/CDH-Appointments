'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import validateBooking from "./validateBooking";

async function bookRoom(previousState, formData) {
    const sessionCookie = (await cookies()).get('appwrite-session');
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
                error: 'You must be logged in to book an appointment'
            };
        }

        // Extract date and time from form data
        const checkInDate = formData.get('check_in_date');
        const checkInTime = formData.get('check_in_time');
        const checkOutTime = formData.get('check_out_time');
        const appointmentType = formData.get('appointment_type');
        const bookingSummary = formData.get('booking_summary');
        const roomId = formData.get('room_id');

        // Combine date and time to ISO 8601 format (treating as local time)
        const checkInDateTime = `${checkInDate}T${checkInTime}:00`;
        const checkOutDateTime = `${checkInDate}T${checkOutTime}:00`; // Use check_in_date for both

        // Validate booking with comprehensive checks
        const validation = await validateBooking(roomId, checkInDateTime, checkOutDateTime, user.id);

        if (validation.error) { 
            return {
                error: validation.error,
            };
         }

        const bookingData = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: user.id,
            room_id: roomId,
            appointment_type: appointmentType,
            booking_summary: bookingSummary
        };

        // Create booking
        const newBooking = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            ID.unique(),
            bookingData
        );

        // Revalidate cache
        revalidatePath('/bookings', 'layout');

        return {
            success: true
        };

    } catch (error) {
        console.log('Failed to book appointment', error);
        return {
            error: 'Something went wrong booking the appointment'
        };
    }
}

export default bookRoom;