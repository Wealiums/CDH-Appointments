import Heading from '@/components/Heading';
import BookedRoomCard from '@/components/BookedRoomCard';
import getMyBookings from '../actions/getMyBookings';

export const dynamic = 'force-dynamic';

const BookingsPage = async () => {
  const bookings = await getMyBookings();

  return (
    <>
      <Heading title='My Appointments' />
      {bookings.length === 0 ? (
        <p className='text-gray-600 mt-4'>You have no appointments</p>
      ) : (
        bookings.map((booking) => (
          <BookedRoomCard key={booking.$id} booking={booking} />
        ))
      )}
    </>
  );
};

export default BookingsPage;