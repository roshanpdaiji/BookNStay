import React, { useEffect, useState } from 'react'
import { roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast, { Toaster } from 'react-hot-toast'


function ListRoom() {

  const [rooms, setRooms] = useState([])
  const { axios, getToken, user,currency } = useAppContext()

  //Fetch rooms of the hotel owner

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms/owner', { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setRooms(data.rooms)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //Toggele availability of the room

  const toggleAvailabilty = async (roomId) => {
    const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
    if (data.success) {
      toast.success(data.message)
      fetchRooms()
    } else {
      toast.error(data.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user])


  return (
    <div>

      <Title title='Room Listings' subTitle="Review and update your hotel rooms to ensure accurate pricing and a better guest experience."
        align='left' font='outfit' />

      <p className='text-gray-500 mt-8'>All Rooms</p>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium'>Facility</th>
              <th className='py-3 px-4 text-gray-800 font-medium'>Price/night</th>
              <th className='py-3 px-4 text-gray-800 font-medium'>Actions</th>

            </tr>
          </thead>

          <tbody className='text-sm'>
            {
              rooms.map((item, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.roomType}</td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.amenities.join(', ')}</td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{currency}{item.pricePerNight}</td>

                  <td className="py-3 px-4 border-t border-gray-300">
                    <button
                      onClick={() => toggleAvailabilty(item._id)}
                      className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 ease-in-out ${item.isAvailable ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${item.isAvailable ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                      />
                    </button>
                  </td>

                </tr>

              ))
            }
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default ListRoom