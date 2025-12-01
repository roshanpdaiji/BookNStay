import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData,} from '../assets/assets'
import StartRating from '../components/StartRating'
import { useAppContext } from '../context/AppContext'
import {toast} from 'react-hot-toast'


function RoomDetails() {

    const { id } = useParams()
    const {rooms,getToken,axios,navigate}=useAppContext()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [checkInDate,setCheckInDate]=useState("")
    const [checkOutDate,setCheckOutDate]=useState("")
    const [guests,setGuests]=useState(1);

    const [isAvailable,setIsAvailable]=useState(false);

    const checkAvailability=async()=>{
        try {
            //check if checkin date is greater than checkout date
            if(checkInDate >= checkOutDate){
                toast.error("Check-In Date should be less than Check-Out Date")
                return;
            }
            const {data} = await axios.post('/api/bookings/check-availability',{room:id,checkInDate,checkOutDate})
            if(data.success){
                if(data.isAvailable){
                    setIsAvailable(true);
                    toast.success("Room is available! You can proceed to book.")
                }else{
                    setIsAvailable(false);
                    toast.error("Room is not available for the selected dates.")
                }

            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    //OnSubmit handler function to check availability and book the room

    const onSubmitHandler=async(e)=>{
        try {
            e.preventDefault();
            if(!isAvailable){
                return checkAvailability();
            }else{
                const {data} = await axios.post('/api/bookings/book',{room:id,checkInDate,checkOutDate,guests,paymentMethod:'Pay at Hotel'},{headers:{Authorization:`Bearer ${await getToken()}`}})
            if(data.success){
                toast.success("Booking successful!")
                navigate('/my-bookings')
                scrollTo(0,0);
            }
            else{
                toast.error(data.message)
            }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const room = rooms.find(room => room._id === id)
        room && setRoom(room)
        room && setMainImage(room.images[0])
    }, [rooms])


    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* Room Details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span>
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-1 mt-2'>
                <StartRating />
                <p className='ml-2'>200+ reviews</p>
            </div>

            {/* Address */}
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="" />
                <span>{room.hotel.address}</span>
            </div>

            {/* Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img className='w-full h-[350px] rounded-xl shadow-lg object-cover' src={mainImage} alt="" />
                </div>

                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            className={`w-full h-[150px] rounded-xl shadow-md object-cover cursor-pointer 
                                ${mainImage === image && 'outline-3 outline-orange-500'}`}
                            onClick={() => setMainImage(image)}
                        />
                    ))}
                </div>
            </div>

            {/* Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>

                    <div className='flex flex-wrap mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img className='w-5 h-5' src={facilityIcons[item]} alt="" />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className='text-2xl font-medium text-gray-800'>$ {room.pricePerNight}/night</p>
            </div>

            {/* Check Form */}
            <form onSubmit={onSubmitHandler}
            className='flex flex-col md:flex-row items-start md:items-center justify-between 
                bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>

                <div className='flex flex-col md:flex-row gap-4 md:gap-10 text-gray-500'>
                    <div>
                        <label className='font-medium' htmlFor="checkInDate">Check-In</label>
                        <input  onChange={(e)=>setCheckInDate(e.target.value)} min={new Date().toISOString().split("T")[0]}

                        type="date" id='checkInDate'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                    <div>
                        <label className='font-medium' htmlFor="checkOutDate">Check-Out</label>
                        <input onChange={(e)=>setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate}
                        type="date" id='checkOutDate'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div>
                        <label className='font-medium' htmlFor="guests">Guests</label>
                    <input
  onChange={(e) => setGuests(e.target.value)}
  value={guests}
  type="number"
  id="guests"
  placeholder="1"
  min={1}
  className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
  required
/>

                    </div>
                </div>

                <button type='submit' className='bg-orange-500 mt-6 md:mt-0 text-white px-6 py-3 rounded-lg'>
                  { isAvailable ? "Book Now" : "Check Availability" }
                </button>
            </form>

            {/* Specs */}
            <div className='mt-20 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} className='w-6 h-6' alt="" />
                        <div>
                            <p className='text-base font-medium'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paragraph */}
            <div className='max-w-3xl border-y border-gray-300 my-10 py-10 text-gray-500'>
                <p>
                    Experience true comfort and convenience during your stay with us. Our hotel offers the perfect blend
                    of luxury, modern amenities, and warm hospitality. Whether you're traveling for business or leisure,
                    our rooms provide a peaceful escape from the busy world.
                </p>
            </div>

            {/* Hosted By */}
            <div className='flex items-center gap-4'>
                <img className='h-16 w-16 md:h-20 md:w-20 rounded-full' src={room.hotel.owner.image} alt="" />
                <div>
                    <p className='text-lg md:text-xl font-medium'>Hosted by {room.hotel.name}</p>
                    <div className='flex items-center mt-1'>
                        <StartRating />
                        <p className='ml-2'>200+ reviews</p>
                    </div>
                </div>
            </div>

            <button className='mt-6 bg-black text-white px-8 py-3 rounded-lg'>
                Contact Now
            </button>

        </div>
    )
}

export default RoomDetails
