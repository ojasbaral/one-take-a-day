import React from 'react'
import Header from '../components/header'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
    const navigate = useNavigate()

  return (
    <div className="h-full">
        <Header list={["REGISTER", "LOGIN", "ABOUT"]}></Header>

    <div className="text-center mt-44">
        <div className="">
            <h1 className="text-7xl">ONE TAKE A DAY</h1>
            <p className="text-2xl ml-3 mr-3">you're one stop shop to agree or disagree with sports takes, just once a day</p>
            <div className="mt-5 flex justify-center ml-9 mr-9">
                <button type="button" className="bg-black text-white mr-4 w-80 h-12 rounded" onClick={() => navigate('/register')}>Register</button>
                <button type="button" className="bg-black text-white ml-4 w-80 h-12 rounded" onClick={() => { navigate('/login')}}>Login</button>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Landing