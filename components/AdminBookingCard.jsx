'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaClock, FaTrash } from 'react-icons/fa';
import cancelBookingAdmin from '@/app/actions/cancelBookingAdmin';
import { toast } from 'react-toastify';

const AdminBookingCard = ({ booking }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date and time
  const parseAsLocalTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [time] = timePart.split('.');
    const [hour, minute] = time.split(':');
    return new Date(year, month - 1, day, hour, minute);
  };

  const formatDateTime = (dateTimeString) => {
    const date = parseAsLocalTime(dateTimeString);
    return date.toLocaleString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTime = (dateTimeString) => {
    const date = parseAsLocalTime(dateTimeString);
    return date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get appointment type icon and label
  const getAppointmentTypeInfo = (type) => {
    switch(type) {
      case 'phone':
        return { icon: <FaPhone className="inline" />, label: 'Phone' };
      case 'zoom':
        return { icon: '📹', label: 'Zoom' };
      case 'in_person':
        return { icon: '🏢', label: 'In Person' };
      default:
        return { icon: <FaCalendarAlt className="inline" />, label: type };
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await cancelBookingAdmin(booking.$id);
      
      if (result.success) {
        toast.success('Booking cancelled successfully');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setIsDeleting(false);
    }
  };

  const appointmentType = getAppointmentTypeInfo(booking.appointment_type);

  return (
    <div className="bg-gray-800 border border-green-600 rounded-lg p-4 mb-4">
      
      {/* Header with Accountant and User */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {booking.room_id?.name || 'Unknown Accountant'}
          </h3>
          <p className="text-green-400 text-sm flex items-center">
            <FaUser className="mr-1" />
            {booking.user_details?.name || 'Unknown User'} ({booking.user_details?.email})
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center">
            {appointmentType.icon} <span className="ml-1">{appointmentType.label}</span>
          </span>
          <button
            onClick={handleCancelBooking}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors disabled:opacity-50"
            title="Cancel Booking"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* Date & Time */}
        <div className="bg-gray-700 p-3 rounded border border-gray-600">
          <h4 className="text-green-400 font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-2" />
            Date & Time
          </h4>
          <p className="text-white text-sm">
            <strong>Start:</strong> {formatDateTime(booking.check_in)}
          </p>
          <p className="text-white text-sm">
            <strong>End:</strong> {formatTime(booking.check_out)}
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-700 p-3 rounded border border-gray-600">
          <h4 className="text-green-400 font-semibold mb-2 flex items-center">
            <FaPhone className="mr-2" />
            Contact
          </h4>
          {booking.room_id?.phoneNumber && (
            <p className="text-white text-sm">
              <strong>Phone:</strong> {booking.room_id.phoneNumber}
            </p>
          )}
          {booking.room_id?.email && (
            <p className="text-white text-sm">
              <strong>Email:</strong> {booking.room_id.email}
            </p>
          )}
        </div>
      </div>

      {/* Appointment Summary */}
      {booking.booking_summary && (
        <div className="bg-gray-700 p-3 rounded border border-gray-600 mb-4">
          <h4 className="text-green-400 font-semibold mb-2">Summary</h4>
          <p className="text-gray-300 text-sm">{booking.booking_summary}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">
          Booking ID: {booking.$id}
        </div>
        <Link
          href={`/appointments/${booking.$id}`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AdminBookingCard;
