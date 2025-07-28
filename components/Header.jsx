'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/CDH-Business-Accountants-logo-Tall.png';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import destroySession from '@/app/actions/destroySession';
import {toast} from 'react-toastify';
import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import checkAdmin from '@/app/actions/checkAdmin';

const Header = () => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            if (isAuthenticated) {
                const { isAdmin } = await checkAdmin();
                setIsAdmin(isAdmin);
            } else {
                setIsAdmin(false);
            }
        };
        fetchAdmin();
    }, [isAuthenticated]);

    const handleLogout = async () => {
        const { success, error } = await destroySession();

        if (success) {
            setIsAuthenticated(false);
            router.push('/login');
        } else {
            toast.error(error);
        }
    };


    return (
        <header className="bg-gray-900 border-b border-green-600">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/">
                    <Image className="h-12 w-12" src={ logo } alt="CDH Appointments" priority={true}/>
                    </Link>
                    <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <Link
                        href="/"
                        className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-600 hover:text-white"
                        >
                        Accountants
                        </Link>
                        {/* <!-- Logged In Only --> */}
                        { isAuthenticated && (
                            <>
                            <Link
                            href="/bookings"
                            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-green-600 hover:text-white"
                            >
                                Appointments
                            </Link>
                            {/* Admin Tab Button */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-600"
                                >
                                    Admin
                                </Link>
                            )}
                            </>
                        ) }
                    </div>
                    </div>
                </div>
                {/* <!-- Right Side Menu --> */}
                <div className="ml-auto">
                    <div className="ml-4 flex items-center md:ml-6">
                    {/* <!-- Logged Out Only --> */}
                    { !isAuthenticated && (
                        <>
                        <Link
                        href="/login"
                        className="mr-3 text-white hover:text-green-400"
                    >
                        <FaSignInAlt className='inline mr-1' /> Login
                    </Link>
                        
                    <Link
                        href="/register"
                        className="mr-3 text-white hover:text-green-400"
                    >
                        <FaUser className='inline mr-1' /> Register
                    </Link>
                        </>
                    ) }
                    
                        {/* <!-- Logged In Only --> */}
                    { isAuthenticated && (
                        <>

                        <button onClick={handleLogout} className="mx-3 text-white hover:text-green-400">
                          <FaSignOutAlt className='inline mr-1' /> Sign Out
                        </button>
                        </>
                    )}
                        {/* <!-- Logged In Only --> */}
                    </div>
                </div>
                </div>
            </nav>

            {/* <!-- Mobile menu --> */}
            <div className="md:hidden bg-gray-800">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    <Link
                        href="/"
                        className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-600 hover:text-white"
                    >
                        Accountants
                    </Link>
                    {/* <!-- Logged In Only --> */}
                    { isAuthenticated && (
                        <>
                            <Link
                                href="/bookings"
                                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-green-600 hover:text-white"
                            >
                                Appointments
                            </Link>
                            {/* Admin Tab Button (Mobile) */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-white bg-green-700 hover:bg-green-600"
                                >
                                    Admin
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
 
export default Header;