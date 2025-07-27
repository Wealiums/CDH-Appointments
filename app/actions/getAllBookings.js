'use server';

import { cookies } from 'next/headers';
import { createAdminClient } from '@/config/appwrite';

async function getAllBookings() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('appwrite-session');
  if (!sessionCookie) return [];

  try {
    const { databases } = await createAdminClient();
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS
    );
    return bookings ?? [];
  } catch (error) {
    console.log('Failed to get all bookings', error);
    return [];
  }
}

export default getAllBookings;