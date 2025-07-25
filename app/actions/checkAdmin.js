'use server';

import checkAuth from './checkAuth';

// Define additional admin email addresses
const ADMIN_EMAILS = [

    'brodie.j.weal@gmail.com',
    'kaarina@cdhba.com.au',
    'michelle@cdhba.com.au',
    'brian@cdhba.com.au',
    'elizabeth@cdhba.com.au',
    'meg@cdhba.com.au'
];

async function checkAdmin() {
    try {
        const { user } = await checkAuth();
        
        if (!user) {
            return { isAdmin: false, user: null };
        }

        // Check if user has "admin" label in Appwrite
        const hasAdminLabel = user.labels && user.labels.includes('admin');
        
        // Check if user's email is in the admin emails list
        const hasAdminEmail = ADMIN_EMAILS.includes(user.email.toLowerCase());
        
        // User is admin if they have either the label OR the email
        const isAdmin = hasAdminLabel || hasAdminEmail;
        
        return { isAdmin, user };
    } catch (error) {
        console.log('Failed to check admin status', error);
        return { isAdmin: false, user: null };
    }
}

export default checkAdmin;
