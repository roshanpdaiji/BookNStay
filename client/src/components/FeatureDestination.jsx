import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

function FeatureDestination() {

    const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
<Title 
  title="Featured Destination" 
  subTitle="Discover our handpicked destinations — curated for your perfect getaway."
/>

     
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {roomsDummyData.slice(0,4).map((room,index)=>(
            <HotelCard key={room._id} room={room} index={index}/>
        ))}
      </div>
   <button
  onClick={() => {
    navigate('/rooms');
    scrollTo(0, 0);
  }}
  className="my-16 px-6 py-3 text-sm md:text-base font-semibold border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer"
>
  View All Destinations
</button>

    </div>
  )
}

export default FeatureDestination
