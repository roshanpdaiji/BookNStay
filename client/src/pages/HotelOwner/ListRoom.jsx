import React, { useState } from 'react'
import { roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title'

function ListRoom() {

  const [rooms, setRooms] = useState(roomsDummyData)

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
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>₹{item.pricePerNight}</td>

                  <td className="py-3 px-4 border-t border-gray-300">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={() => { }}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200 ease-in-out">
                        <div className="w-6 h-6 bg-white rounded-full shadow-md absolute top-[2px] left-[2px] peer-checked:translate-x-5 transition-transform duration-200 ease-in-out"></div>
                      </div>
                    </label>
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