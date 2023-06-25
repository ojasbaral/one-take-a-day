import React from 'react'
import Header from '../components/header'

const About = () => {
  return (
    <div>
      <Header list={['REGISTER', 'LOGIN']}></Header>
      <div className="text-center text-3xl mt-3">WHAT IS ONE TAKE A DAY?</div>
      <div className="text-xl text-center ml-24 mr-24 mt-2">One Take a Day is a website where you can share your best, or worst sports takes once a day! You can follow your friends and see their takes, and go though that days most popular takes! Hit that register button and get started today on One Take a Day to share your favorite takes!</div>

      <div className="text-center text-3xl mt-10">ABOUT THE DEVELOPER</div>
      <div className="text-xl text-center ml-24 mr-24 mt-2">One Take a Day was developed by a college student studying computer science! This is his first full stack website and appreciates all the support!</div>
    </div>
  )
}

export default About