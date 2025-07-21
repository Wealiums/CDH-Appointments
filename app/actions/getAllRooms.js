'use server';

import { createAdminClient } from "@/config/appwrite"; 
import { revalidatePath } from "next/cache";
import {redirect } from "next/navigation";  

async function getAllRooms() {
    try {
        const { databases } = await createAdminClient();

        // Fetch rooms
        const { documents: rooms } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
        );

        // Revalidate the cache for this path
<<<<<<< HEAD
        revalidatePath('/', 'layout');
=======
        // revalidatePath('/', 'layout');
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0

        return rooms;
    } catch (error) {
        console.log('Failed to get rooms', error);
        redirect('/error');
    }
}

export default getAllRooms;
