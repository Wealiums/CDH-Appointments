import Heading from '@/components/Heading';
import RoomCard from '@/components/RoomCard';
import getAllRooms from './actions/getAllRooms';

export default async function Home() {
  const rooms = await getAllRooms();
  
  return (
    <>
      <Heading title='Available accountants' />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (<p>No accountants available at the moment</p>) }
    </>
  );
}
