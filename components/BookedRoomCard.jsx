import Link from 'next/link';
import CancelBookingButton from './CancelBookingButton';

const BookedRoomCard = ({ booking }) => {
    const { room_id:room } = booking;

    // Format date and time
    const formatDateTime = (dateTimeString) => {
        // Create date from the ISO string, treating it as local time
        const [datePart, timePart] = dateTimeString.split('T');
        const [year, month, day] = datePart.split('-');
        const [time] = timePart.split('.');
        const [hour, minute] = time.split(':');
        
        const date = new Date(year, month - 1, day, hour, minute);
        return date.toLocaleString('en-GB', {
            month: 'long',
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (       
    <div
        className="bg-gray-800 shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-green-600"
      >
        <div>
          <h4 className="text-lg font-semibold text-white">{ room.name }</h4>
          <p className="text-sm text-gray-300">
            <strong>Check In:</strong> { formatDateTime(booking.check_in) }
          </p>
          <p className="text-sm text-gray-300">
            <strong>Check Out:</strong> { formatDateTime(booking.check_out) }
          </p>
        </div>
        <div
          className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0"
        >
          <Link
            href={`/appointments/${booking.$id}`}
            className="bg-green-600 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-green-700"
          >
            View Appointment
          </Link>
          <CancelBookingButton bookingId={booking.$id} />
          
        </div>
    </div> );
}
 
export default BookedRoomCard;