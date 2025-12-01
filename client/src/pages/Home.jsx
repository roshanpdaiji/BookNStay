import React from 'react'
import Hero from '../components/Hero'
import FeatureDestination from '../components/FeatureDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import RecommendeHotels from '../components/RecommendedHotels'

function Home() {
  return (
    <div>
      <Hero/>
      <RecommendeHotels/>
      <FeatureDestination/>
      <ExclusiveOffers/>
      <Testimonial/>
      <NewsLetter/>
    </div>
  )
}

export default Home
