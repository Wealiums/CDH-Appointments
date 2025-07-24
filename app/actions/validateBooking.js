'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import checkAuth from './checkAuth';
import getSingleRoom from './getSingleRoom';

// Convert a date string to a Luxon DateTime object as local time
function toLocalDateTime(dateString) {
    // Parse as local time instead of UTC
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return DateTime.local(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), parseInt(minute));
}

// Check for overlapping date ranges
function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
}

// Check for overlapping date ranges with 30-minute buffer
function dateRangesOverlapWithBuffer(checkInA, checkOutA, checkInB, checkOutB) {
    // Add 30-minute buffer before and after existing appointments
    const bufferMinutes = 30;
    const bufferedCheckInB = checkInB.minus({ minutes: bufferMinutes });
    const bufferedCheckOutB = checkOutB.plus({ minutes: bufferMinutes });
    
    return checkInA < bufferedCheckOutB && checkOutA > bufferedCheckInB;
}

// Parse availability string (e.g., "9 AM - 5 PM" or "8:30 AM - 5 PM") into 24-hour format
function parseAvailabilityHours(availability) {
    try {
        // Updated regex to handle both "9 AM" and "8:30 AM" formats
        const match = availability.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
        if (!match) return null;
        
        let startHour = parseInt(match[1]);
        const startMinutes = parseInt(match[2] || 0); // Default to 0 if no minutes
        let endHour = parseInt(match[4]);
        const endMinutes = parseInt(match[5] || 0); // Default to 0 if no minutes
        const startPeriod = match[3].toUpperCase();
        const endPeriod = match[6].toUpperCase();
        
        // Convert to 24-hour format
        if (startPeriod === 'PM' && startHour !== 12) startHour += 12;
        if (startPeriod === 'AM' && startHour === 12) startHour = 0;
        if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
        if (endPeriod === 'AM' && endHour === 12) endHour = 0;
        
        // Convert to decimal hours for easier comparison (e.g., 8:30 = 8.5)
        const startDecimal = startHour + (startMinutes / 60);
        const endDecimal = endHour + (endMinutes / 60);
        
        return { startHour: startDecimal, endHour: endDecimal };
    } catch (error) {
        console.log('Error parsing availability:', error);
        return null;
    }
}

async function validateBooking(roomId, checkIn, checkOut, userId = null) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(
            sessionCookie.value
        );

        // Get user ID if not provided
        if (!userId) {
            const { user } = await checkAuth();
            if (!user) {
                return { error: 'User not authenticated' };
            }
            userId = user.id;
        }

        const checkInDateTime = toLocalDateTime(checkIn);
        const checkOutDateTime = toLocalDateTime(checkOut);
        const now = DateTime.now();

        // 1. Check if booking is in the past
        if (checkInDateTime <= now) {
            return { error: 'Cannot book appointments in the past' };
        }

        // 2. Check if booking is within 1 hour of current time
        const oneHourFromNow = now.plus({ hours: 1 });
        if (checkInDateTime < oneHourFromNow) {
            return { error: 'Cannot book appointments within 1 hour of current time' };
        }

        // 3. Get room details for availability check
        const room = await getSingleRoom(roomId);
        if (!room) {
            return { error: 'Room not found' };
        }

        // 4. Check if booking is within room availability hours
        const availabilityHours = parseAvailabilityHours(room.availability);
        if (availabilityHours) {
            // Convert booking times to decimal hours for comparison
            const bookingStartDecimal = checkInDateTime.hour + (checkInDateTime.minute / 60);
            const bookingEndDecimal = checkOutDateTime.hour + (checkOutDateTime.minute / 60);
            
            if (bookingStartDecimal < availabilityHours.startHour || 
                bookingEndDecimal > availabilityHours.endHour ||
                bookingStartDecimal >= availabilityHours.endHour) {
                return { error: `Appointments must be within availability hours: ${room.availability}` };
            }
        }

        // 5. Check for user double booking (user has conflicting appointment with ANY accountant)
        const { documents: userBookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('user_id', userId)]
        );

        for (const booking of userBookings) {
            const bookingCheckInDateTime = toLocalDateTime(booking.check_in);
            const bookingCheckOutDateTime = toLocalDateTime(booking.check_out);

            if (dateRangesOverlapWithBuffer(
                checkInDateTime,
                checkOutDateTime,
                bookingCheckInDateTime,
                bookingCheckOutDateTime
            )) {
                return { error: 'You already have an appointment scheduled too close to this time. Please allow at least 30 minutes between appointments.' };
            }
        }

        // 6. Check for accountant availability (accountant is not booked by someone else)
        const { documents: accountantBookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('room_id', roomId)]
        );

        for (const booking of accountantBookings) {
            const bookingCheckInDateTime = toLocalDateTime(booking.check_in);
            const bookingCheckOutDateTime = toLocalDateTime(booking.check_out);

            if (dateRangesOverlapWithBuffer(
                checkInDateTime,
                checkOutDateTime,
                bookingCheckInDateTime,
                bookingCheckOutDateTime
            )) {
                return { error: 'This accountant is not available during the selected time. Please allow at least 30 minutes between appointments.' };
            }
        }

        // All validations passed
        return { success: true };

    } catch (error) {
        console.log('Failed to validate booking', error);
        return { error: 'Failed to validate booking' };
    }
}

export default validateBooking;
