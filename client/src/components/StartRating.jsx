import React from 'react'
import { assets } from '../assets/assets'

function StartRating({rating = 4}) {
  return (
    <>
  {Array(5).fill(0).map((_, index) => (
  <img
    key={index}
    src={rating > index ? assets.starIconFilled : assets.starIconOutlined}
    alt={`${index + 1} star`}
    className='w-4.5 h-4.5'
  />
))}

    </>
  )
}

export default StartRating
