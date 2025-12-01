import React, { useEffect, useState } from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function RecommendeHotels() {

const { rooms, searchedCities } = useAppContext();
const [recommended, setRecommended] = useState([]);

const filterHotels = () => {
  if (!searchedCities.length) {
    setRecommended(rooms); // show all initially
    return;
  }

  const filteredHotels = rooms.filter(room =>
    searchedCities.includes(room?.hotel?.city)
  );
  setRecommended(filteredHotels);
};


useEffect(() => {
  filterHotels();
}, [rooms, searchedCities]);

  return recommended.length > 0 && (

    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked destinations — curated for your perfect getaway."
      />


      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    

    </div>
  )
}

export default RecommendeHotels
