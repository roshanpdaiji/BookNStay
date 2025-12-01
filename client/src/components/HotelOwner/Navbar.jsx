import React from 'react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import LogoGoNStay from "../../assets/LogoGoNStay.png";


function Navbar() {
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
      
            {/* Logo */}
            <Link to='/'>
             <img
  src={LogoGoNStay}
  alt="GoNStay Logo"
  className="h-10 md:h-12 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
/>

            </Link>
            <UserButton/>

    </div>
  )
}

export default Navbar
