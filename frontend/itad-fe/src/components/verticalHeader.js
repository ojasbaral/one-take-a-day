import React from 'react'
import Logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const VerticalHeader = ({ user_id, account_id, view_id, friend_id, search_id }) => {
    const navigate = useNavigate()

    function handleLogo(){
        if (user_id !== 0)
            return navigate('/home/' + user_id)
    }

    async function handleLogout(){
        await fetch('/auth/logout').then().then()
        return navigate('/')
    }

    function handleAccount(){
        if(user_id === 0 || friend_id === 0 || search_id === 0){
            navigate('/account/' + view_id + '/' + view_id)
            window.location.reload(false)
        }
        else if((account_id !== view_id)){
            navigate('/account/' + view_id + '/' + view_id)
            window.location.reload(false)
        }
    }

    function handleFriends(){
        if(friend_id !== 0){
            return navigate('/friends/' + friend_id)
        }
    }

    return (
        <div className="vertical-center inline-block mr-0">
            <img className="h-14 mt-3 ml-3 cursor-pointer" src={Logo} onClick={handleLogo}></img>
            <div className="text-2xl mt-16 inline-block mr-0 max-w-0">
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleLogo}>HOME</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">TRENDING</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleFriends}>FRIENDS</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleAccount}>ACCOUNT</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0">SETTINGS</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0 text-red-600" onClick={handleLogout}>LOGOUT</h3>
            </div>
        </div>
      )
}

export default VerticalHeader