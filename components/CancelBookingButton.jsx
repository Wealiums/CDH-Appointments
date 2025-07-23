'use client';
import cancelBooking from "@/app/actions/cancelBooking";
import { toast } from "react-toastify";

const CancelBookingButton = ({ bookingId }) => {
    const handleCancelClick = async () => {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            const result = await cancelBooking(bookingId);

            if (result.success) {
                toast.success('Appointment has been cancelled');
            }
        } catch (error) {
            console.log('Failed to cancel appointment', error);
            return{
                error: 'Failed to cancel appointment',
            };
        }
    };
    
    return ( 
        <button
            onClick={ handleCancelClick }
            className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
        >
            Cancel Appointment
        </button> 
    );
}
 
export default CancelBookingButton;