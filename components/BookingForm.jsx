'use client';
import {useRouter} from 'next/navigation';
import { useEffect } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';
import bookRoom from '@/app/actions/bookRoom';

const BookingForm = ({ room }) => {
  const [state, formAction] = useActionState(bookRoom, {});

  const router = useRouter();

  useEffect(() => {
    if(state.error) toast.error(state.error);
    if(state.success) {
      toast.success('Appointment has been booked');
      router.push('/bookings');
    }
  }, [state]);

    return (         
    <div className="mt-6">
          <h2 className="text-xl font-bold text-white">Book this Accountant</h2>
          <form action={formAction} className="mt-4">
            <input type='hidden' name='room_id' value={room.$id} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="check_in_date"
                  className="block text-sm font-medium text-white"
                >
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="check_in_date"
                  name="check_in_date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="check_in_time"
                  className="block text-sm font-medium text-white"
                >
                  Appointment Start Time
                </label>
                <input
                  type="time"
                  id="check_in_time"
                  name="check_in_time"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="check_out_time"
                  className="block text-sm font-medium text-white"
                >
                  Appointment End Time
                </label>
                <input
                  type="time"
                  id="check_out_time"
                  name="check_out_time"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="appointment_type"
                  className="block text-sm font-medium text-white"
                >
                  Appointment Type
                </label>
                <select
                  id="appointment_type"
                  name="appointment_type"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white"
                  required
                >
                  <option value="">Select type</option>
                  <option value="phone">Phone</option>
                  <option value="zoom">Zoom</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="booking_summary"
                className="block text-sm font-medium text-white"
              >
                Appointment Summary (What would you like to discuss?)
              </label>
              <textarea
                id="booking_summary"
                name="booking_summary"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-700 text-white placeholder-gray-400"
                placeholder="Please provide a brief summary of what you'd like to discuss during your appointment..."
                required
              ></textarea>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div> );
}

export default BookingForm;