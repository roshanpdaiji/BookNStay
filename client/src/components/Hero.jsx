import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

function Hero() {

    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");

    const onSearch = async (e) => {
        e.preventDefault();
        navigate(`/rooms?destination=${destination}`);

        // call api to save recent searched city
        await axios.post(
            '/api/user/store-recent-search',
            { recentSearchedCity: destination },
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );

        // Add destination to searchedCities (max 3 recent searched)
        setSearchedCities((prevSearchedCities) => {
            const updatedSearchedCities = [...prevSearchedCities, destination];
            if (updatedSearchedCities.length > 3) {
                updatedSearchedCities.shift();
            }
            return updatedSearchedCities;
        });
    };

    return (
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>

            <p className='text-lg md:text-xl font-light tracking-wide'>
                The Ultimate Hotel Experience
            </p>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl mt-2'>
                Discover Your Perfect Gateway Destination
            </h1>

            <p className='mt-6 text-base md:text-lg max-w-lg opacity-90 leading-relaxed'>
                Search, compare, and book the best hotels at unbeatable prices.
                Your next stay is just <span className='font-semibold'>one click away.</span>
            </p>

            <form onSubmit={onSearch}
                className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8  flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

                <div>
                    <div className='flex items-center gap-2'>
                        <img className='h-4' src={assets.calenderIcon} alt="" />
                        <label htmlFor="destinationInput">Destination</label>
                    </div>
                    <input onChange={e => setDestination(e.target.value)} value={destination}
                        list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
                    <datalist id='destinations'>
                        {cities.map((city, index) => (
                            <option value={city} key={index}>
                                {city}
                            </option>
                        ))}

                    </datalist>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img className='h-4' src={assets.calenderIcon} alt="" />

                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img className='h-4' src={assets.calenderIcon} alt="" />

                        <label htmlFor="checkOut">Check out</label>
                    </div>
                    <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                    <img className='h-7' src={assets.searchIcon} alt="seacrhIcon" />

                    <span>Search</span>
                </button>
            </form>

        </div>
    );
}

export default Hero;
