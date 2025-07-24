import Image from "next/image";
import Link from "next/link";

const RoomCard = ({ room }) => {
    return ( <div
        className="bg-gray-800 shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-green-600"
      >
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <Image
            src={ `/images/rooms/${room.image}` }
            width={400}
            height={100}
            alt={ room.name }
            className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg"
          />
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-white">{ room.name }</h4>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-green-400">Phone Number:</span> { room.phoneNumber }
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-green-400">Email:</span> { room.email }
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-green-400"> Availability:</span>
              { room.availability }
            </p>
          </div>
        </div>
        <div
          className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0"
        >
          <Link
            href={ `/rooms/${room.$id}` }
            className="bg-green-600 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-green-700"
            >View Accountant
          </Link>
        </div>
      </div> );
}
 
export default RoomCard;