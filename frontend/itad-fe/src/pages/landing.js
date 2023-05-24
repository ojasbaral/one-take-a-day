import React from 'react'
import Logo from '../assets/logo.png'

const Landing = () => {
  return (
    <div className="h-full">
    <div className="flex justify-between items-center">
        <img className="h-12 mt-3 ml-3 cursor-pointer" src={Logo}></img>
        <div className="flex text-2xl">
            <h3 className="mr-9 cursor-pointer">REGISTER</h3>
            <h3 className="mr-9 cursor-pointer">LOGIN</h3>
            <h3 className="mr-5 cursor-pointer">ABOUT</h3>
        </div>
    </div>

    <div className="text-center mt-44">
        <div className="">
            <h1 className="text-8xl">ONE TAKE A DAY</h1>
            <p className="text-2xl">you're one stop shop to agree or disagree with sports takes, just once a day</p>
            <div className="mt-5 flex justify-center ml-9 mr-9">
                <button type="button" className="bg-black text-white mr-8 w-80 h-12 rounded" >Register</button>
                <button type="button" className="bg-black text-white ml-8 w-80 h-12 rounded">Login</button>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Landing