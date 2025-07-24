'use server';

import checkAuth from './checkAuth';

// Define additional admin email addresses (beyond the "admin" label)
const ADMIN_EMAILS = [
    // Your specified admins
    'brodie.j.weal@gmail.com',
    'kaarina@cdhba.com.au',
    
    // Accountant emails from rooms data
    'michelle.weal@cdhaccountants.com',
    'brian.weal@cdhaccountants.com',
    'creative.hub@cdhaccountants.com',
    'training@cdhaccountants.com',
    'quiet.meeting@cdhaccountants.com',
    'quiet.meeting2@cdhaccountants.com',
    'lizzy.walker@cdhaccountants.com',
    'meg.hegarty@cdhaccountants.com'
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
