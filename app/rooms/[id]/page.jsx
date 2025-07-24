import getSingleRoom from "@/app/actions/getSingleRoom";
import Heading from "@/components/Heading";
import BookingForm from "@/components/BookingForm"; 
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

const RoomPage = async ({ params }) => { 
    const { id } = await params;
    const room = await getSingleRoom(id);

    if (!room) {
        return <Heading title="Accountant Not Found" />
    }

    return ( <>
        <Heading title={room.name} />
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-green-600">
            <Link
                href="/"
                className="flex items-center text-green-400 hover:text-green-300 mb-4"
            >
                <FaChevronLeft className='inline mr-1' />
                <span className="ml-2">Back to Accountants</span>
            </Link>

            <div className="flex flex-col sm:flex-row sm:space-x-6">
                <Image
                    src={`/images/rooms/${room.image}`}
                    alt={room.name}
                    width={400}
                    height={100}
                    className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
                />

                <div className="mt-4 sm:mt-0 sm:flex-1">
                    <ul className="space-y-2">
                        <li>
                            <span className="font-semibold text-green-400">Phone Number:</span> <span className="text-white">{room.phoneNumber}</span>
                        </li>
                        <li>
                            <span className="font-semibold text-green-400">Email:</span> <span className="text-white">{room.email}</span>
                        </li>
                        <li>
                            <span className="font-semibold text-green-400">Availability:</span> <span className="text-white">{room.availability}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <BookingForm room={room}/>
        </div>
    </> );
};
 
export default RoomPage;