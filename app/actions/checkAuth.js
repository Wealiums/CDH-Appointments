'use client';
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function checkAuth() {
    const sessionCookie = cookies().get

    if (!sessionCookie) {
        return {
            isAuthenticated: false
        }
    }

    try {
        const { account }
    } catch (error) {
        
    }
}

export default checkAuth;