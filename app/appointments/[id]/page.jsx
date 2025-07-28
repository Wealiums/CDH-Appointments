import Heading from '@/components/Heading';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUser, FaPhone, FaVideo, FaBuilding } from 'react-icons/fa';
import getBookingById from '@/app/actions/getBookingById';

const AppointmentDetailsPage = async ({ params }) => {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  // Helper function to parse datetime as local time
  const parseAsLocalTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [time] = timePart.split('.');
    const [hour, minute] = time.split(':');
    return new Date(year, month - 1, day, hour, minute);
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      month: 'long',
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-AU', {
      timeZone: 'Australia/Sydney',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-AU', {
      timeZone: 'Australia/Sydney',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get appointment type icon
  const getAppointmentTypeIcon = (type) => {
    switch(type) {
      case 'phone':
        return <FaPhone className="inline mr-2" />;
      case 'zoom':
        return <FaVideo className="inline mr-2" />;
      case 'in_person':
        return <FaBuilding className="inline mr-2" />;
      default:
        return <FaCalendarAlt className="inline mr-2" />;
    }
  };

  const getAppointmentTypeLabel = (type) => {
    switch(type) {
      case 'phone':
        return 'Phone Call';
      case 'zoom':
        return 'Video Call (Zoom)';
      case 'in_person':
        return 'In Person';
      default:
        return type;
    }
  };

  return (
    <>
      <Heading title="Appointment Details" />
      
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/bookings" 
          className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Appointments
        </Link>
      </div>

      {/* Appointment Details Card */}
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-green-600">
        
        {/* Accountant Name */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            <FaUser className="inline mr-3 text-green-400" />
            {booking.room_id?.name || 'Accountant'}
          </h2>
        </div>

        {/* Appointment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Date */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              Date
            </h3>
            <p className="text-white text-lg">{formatDate(booking.check_in)}</p>
          </div>

          {/* Time */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              <FaClock className="inline mr-2" />
              Time
            </h3>
            <p className="text-white text-lg">
              {formatTime(booking.check_in)} - {formatTime(booking.check_out)}
            </p>
          </div>

          {/* Appointment Type */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              {getAppointmentTypeIcon(booking.appointment_type)}
              Type
            </h3>
            <p className="text-white text-lg">{getAppointmentTypeLabel(booking.appointment_type)}</p>
          </div>

          {/* Duration */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              <FaClock className="inline mr-2" />
              Duration
            </h3>
            <p className="text-white text-lg">
              {Math.round((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60))} minutes
            </p>
          </div>
        </div>

        {/* Appointment Summary */}
        {booking.booking_summary && (
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Appointment Summary
            </h3>
            <p className="text-gray-300 leading-relaxed">{booking.booking_summary}</p>
          </div>
        )}

        {/* Accountant Contact Info */}
        {booking.room_id && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              {booking.room_id.phoneNumber && (
                <p className="text-gray-300">
                  <strong className="text-white">Phone:</strong> {booking.room_id.phoneNumber}
                </p>
              )}
              {booking.room_id.email && (
                <p className="text-gray-300">
                  <strong className="text-white">Email:</strong> {booking.room_id.email}
                </p>
              )}
              {booking.room_id.availability && (
                <p className="text-gray-300">
                  <strong className="text-white">Availability:</strong> {booking.room_id.availability}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentDetailsPage;
