'use server';
import { createSessionClient } from "@/config/appwrite";
import { cookies } from 'next/headers';

async function destroySession() {
    // Await cookies() to get the cookie store
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');

    if (!sessionCookie) {
        return {
            error: 'No session cookie found'
        }
    }
    
    try {
        const { account } = await createSessionClient(sessionCookie.value);

        // Delete session
        await account.deleteSession('current');

        // Clear session cookie
        cookieStore.delete('appwrite-session');

        return {
            success: true,
        }

    } catch (error) {
      return {
        error: 'Error deleting session'
      }
    }
}

export default destroySession;