'use server';

async function createSession(formData) {
    const email = formData.get('email');
    const password = formData.get('password');
        
    console.log(email, password);
}

export default createSession;