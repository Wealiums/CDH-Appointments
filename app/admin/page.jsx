import { redirect } from 'next/navigation';
import checkAdmin from '../actions/checkAdmin';
import getAllBookingsAdmin from '../actions/getAllBookingsAdmin';
import Heading from '@/components/Heading';
import Link from 'next/link';
import CancelBookingButton from '@/components/CancelBookingButton';

// Add this import for deleting bookings
import cancelBooking from '../actions/cancelBooking';

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-GB', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper to group bookings by accountant
function groupByAccountant(bookings) {
  const grouped = {};
  for (const booking of bookings) {
    const accountantName = booking.room_id?.name || booking.room_id || 'Unknown Accountant';
    if (!grouped[accountantName]) grouped[accountantName] = [];
    grouped[accountantName].push(booking);
  }
  // Sort each accountant's bookings by check_in time
  for (const name in grouped) {
    grouped[name].sort((a, b) => new Date(a.check_in) - new Date(b.check_in));
  }
  return grouped;
}

const AdminPage = async () => {
  const { isAdmin } = await checkAdmin();
  if (!isAdmin) redirect('/');

  let bookings = await getAllBookingsAdmin();

  // Delete expired bookings
  const now = new Date();
  for (const booking of bookings) {
    if (new Date(booking.check_out) < now) {
      await cancelBooking(booking.$id);
    }
  }

  // Refetch bookings after cleanup
  bookings = await getAllBookingsAdmin();

  const grouped = groupByAccountant(bookings);

  return (
    <div className="w-full px-2 py-8">
      <Heading title="All Bookings" />
      {bookings.length === 0 ? (
        <p className="text-gray-600 mt-4">No bookings found.</p>
      ) : (
        Object.entries(grouped).map(([accountant, accBookings]) => (
          <section key={accountant} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">{accountant}</h2>
            <ul className="space-y-6">
              {accBookings.map((booking) => (
                <li
                  key={booking.$id}
                  className="bg-gray-800 rounded-lg border border-green-600 p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  {/* Booking Info */}
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="text-lg font-bold text-white">
                      {booking.name || booking.user_details?.name || booking.user_id || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-semibold text-white">Type:</span>{" "}
                      <span className="text-white">{booking.appointment_type}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white">Start:</span>{" "}
                      <span className="text-white">{formatDateTime(booking.check_in)}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white">End:</span>{" "}
                      <span className="text-white">{formatDateTime(booking.check_out)}</span>
                    </div>
                  </div>
                  {/* Buttons: stack on mobile, row on desktop */}
                  <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-2 md:ml-6">
                    <Link
                      href={`/appointments/${booking.$id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors w-full md:w-auto text-center"
                    >
                      View Appointment
                    </Link>
                    <CancelBookingButton
                      bookingId={booking.$id}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors w-full md:w-auto text-center"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
};

export default AdminPage;
