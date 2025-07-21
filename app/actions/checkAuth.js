'use server';
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function checkAuth() {
<<<<<<< HEAD
    const sessionCookie = await cookies().get('appwrite-session');
=======
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0

    if (!sessionCookie) {
        return {
            isAuthenticated: false
        }
    }

    try {
        const { account } = await createSessionClient(sessionCookie.value);
        const user = await account.get();

        return {
            isAuthenticated: true,
            user: {
                id: user.$id,
                name: user.name,
                email: user.email,
            },
        };
    } catch (error) {
      return {
        isAuthenticated: false,  
      };    
    }
}

export default checkAuth;