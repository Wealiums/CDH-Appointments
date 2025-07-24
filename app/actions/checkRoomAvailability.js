'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from "next/navigation";
import { DateTime } from "luxon";


// Convert a date string to a Luxon DateTime object in UTC
function toUTCDateTime(dateSring) {
    return DateTime.fromISO(dateSring, { zone: 'utc' }).toUTC();
}

async function checkRoomAvailability(roomId, checkIn, checkOut) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(
            sessionCookie.value
        );

        //Fetch all bookings for a given accountant

        const { documents: bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('room_id', roomId)]
        );

        //Loop over bookings and check for overlap
        for (const booking of bookings) {
            const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);
        }


    } catch (error) {
        console.log('Failed to check availability', error);
        return {
            error: 'Failed to check availability',
        };
    }
}

export default checkRoomAvailability;