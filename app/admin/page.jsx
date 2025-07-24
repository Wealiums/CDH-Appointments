import { redirect } from 'next/navigation';
import checkAdmin from '../actions/checkAdmin';
import Heading from '@/components/Heading';
import Link from 'next/link';
import { FaCalendarAlt, FaUsers, FaCog } from 'react-icons/fa';

const AdminDashboard = async () => {
  const { isAdmin } = await checkAdmin();
  
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <>
      <Heading title="Admin Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Bookings Management */}
        <Link 
          href="/admin/bookings"
          className="bg-gray-800 border border-green-600 rounded-lg p-6 hover:bg-gray-700 transition-colors group"
        >
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-green-400 text-2xl mr-3" />
            <h2 className="text-xl font-semibold text-white">All Bookings</h2>
          </div>
          <p className="text-gray-300">
            View, manage and cancel all appointment bookings across all accountants.
          </p>
          <div className="mt-4 text-green-400 group-hover:text-green-300">
            Manage Bookings →
          </div>
        </Link>

        {/* Future: User Management */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 opacity-60">
          <div className="flex items-center mb-4">
            <FaUsers className="text-gray-400 text-2xl mr-3" />
            <h2 className="text-xl font-semibold text-gray-400">User Management</h2>
          </div>
          <p className="text-gray-500">
            Manage user accounts and permissions.
          </p>
          <div className="mt-4 text-gray-500">
            Coming Soon
          </div>
        </div>

        {/* Future: System Settings */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 opacity-60">
          <div className="flex items-center mb-4">
            <FaCog className="text-gray-400 text-2xl mr-3" />
            <h2 className="text-xl font-semibold text-gray-400">Settings</h2>
          </div>
          <p className="text-gray-500">
            Configure system settings and preferences.
          </p>
          <div className="mt-4 text-gray-500">
            Coming Soon
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
