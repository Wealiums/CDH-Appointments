'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo.svg';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import destroySession from '@/app/actions/destroySession';
import {toast} from 'react-toastify';
import { useAuth } from '@/context/authContext';

const Header = () => {
    const router = useRouter();

    const { isAuthenticated, setIsAuthenticated } = useAuth();

    

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
        <header className="bg-gray-100">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/">
                    <Image className="h-12 w-12" src={ logo } alt="Bookit" priority={true}/>
                    </Link>
                    <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <Link
                        href="/"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                        >
                        Rooms
                        </Link>
                        {/* <!-- Logged In Only --> */}
<<<<<<< HEAD
                        <Link
                        href="/bookings"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
=======
                        { isAuthenticated && (
                            <>
                            <Link
                            href="/bookings"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0
                        >
                            Bookings
                        </Link>
                        <Link
<<<<<<< HEAD
                        href="/add-room"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
=======
                            href="/rooms/add"
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0
                        >
                        Add Room
                        </Link>
                            </>
                        ) }
                        
                        
                    </div>
                    </div>
                </div>
                {/* <!-- Right Side Menu --> */}
                <div className="ml-auto">
                    <div className="ml-4 flex items-center md:ml-6">
                    {/* <!-- Logged Out Only --> */}
<<<<<<< HEAD
                    <Link
=======
                    { !isAuthenticated && (
                        <>
                        <Link
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0
                        href="/login"
                        className="mr-3 text-gray-800 hover:text-gray-600"
                    >
                        <FaSignInAlt className='inline mr-1' /> Login
                    </Link>
                        
                    <Link
                        href="/register"
                        className="mr-3 text-gray-800 hover:text-gray-600"
                    >
                        <FaUser className='inline mr-1' /> Register
                    </Link>
                        </>
                    ) }
                    
                        {/* <!-- Logged In Only --> */}
<<<<<<< HEAD
                    <Link href="/my-rooms">
                        <FaBuilding className='inline mr-1' /> My Rooms
                    </Link>
                        {/* <!-- Logged In Only --> */}
                    <Link
                        href="/login"
                        className="mx-3 text-gray-800 hover:text-gray-600"
                    >
                        <FaSignOutAlt className='inline mr-1' /> Sign Out
                    </Link>
=======
                    { isAuthenticated && (
                        <>
                        <Link href="/rooms/my">
                        <FaBuilding className='inline mr-1' /> My Rooms
                    </Link>
                        {/* <!-- Logged In Only --> */}
                    <button onClick={handleLogout} className="mx-3 text-gray-800 hover:text-gray-600">
                        <FaSignOutAlt className='inline mr-1' /> Sign Out
                    </button>
                        </>
                    )}
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0
                        {/* <!-- Logged In Only --> */}
                    </div>
                </div>
                </div>
            </nav>

            {/* <!-- Mobile menu --> */}
            <div className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                <Link
                    href="/"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                    Rooms
                </Link>
                        {/* <!-- Logged In Only --> */}
                {/* <!-- Logged In Only --> */}
<<<<<<< HEAD
                <Link
=======
                { isAuthenticated && (
                    <>
                    <Link
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0
                    href="/bookings"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                    Bookings
                </Link>
                        {/* <!-- Logged In Only --> */}
                <Link
<<<<<<< HEAD
                    href="/add-room"
=======
                    href="/rooms/add"
>>>>>>> 17f32d1ab1094769f88ed438e2e8f1126a1df1e0
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                    Add Room
                </Link>
                    </>
                )}
                
                        {/* <!-- Logged In Only --> */}
                </div>
            </div>
        </header>
    );
}
 
export default Header;