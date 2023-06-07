import React from 'react'
import Logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const VerticalHeader = () => {
    const navigate = useNavigate()

    function handleLogo(){
        return navigate('/home')
    }

    async function handleLogout(){
        await fetch('/auth/logout').then().then()
        return navigate('/')
    }

    return (
        <div className="vertical-center inline-block mr-0">
            <img className="h-14 mt-3 ml-3 cursor-pointer" src={Logo} onClick={handleLogo}></img>
            <div className="text-2xl mt-16 inline-block mr-0 max-w-0">
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">HOME</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">TRENDING</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">FRIENDS</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">ACCOUNT</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">SETTINGS</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0 text-red-600" onClick={handleLogout}>LOGOUT</h3>
            </div>
        </div>
      )
}

export default VerticalHeader