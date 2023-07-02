import React, { useState } from 'react'
import Logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const VerticalHeader = ({ user_id, account_id, view_id, friend_id, search_id, trending_id, hashtag_id, settings_id, post_id }) => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(true)
    function handleLogo(){
        if (user_id !== 0)
            return navigate('/home/' + user_id)
    }

    async function handleLogout(){
        await fetch('https://api.onetakeaday.com' + '/auth/logout', {
            credentials: "include",
            headers: {
              "Content-type": "application/json"
          }
        })
        .then((res) => res.json())
        .then((json) => {
            if (json.message === 'cookies cleared'){
                return navigate('/')
            }
        })
    }

    function handleAccount(){
        if(user_id === 0 || friend_id === 0 || search_id === 0 || trending_id === 0 || hashtag_id === 0 || settings_id == 0 || post_id === 0){
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

    function handleTrending(){
        if(trending_id !== 0){
            return navigate('/trending/' + trending_id)
        }
    }

    function handleSettings(){
        if(settings_id !== 0){
            return navigate('/settings/' + settings_id)
        }
    }

    if(collapsed){
        return (
            <div className="ml-2 mt-2">
                <a className="text-2xl cursor-pointer" onClick={() => setCollapsed(false)}>&#9776;</a>
            </div>
        )
    }

    return (
        <div className="vertical-center inline-block mr-30">
            
            
            <div>
            <a className="ml-5 text-6xl cursor-pointer mt-3" onClick={() => setCollapsed(true)}>&times;</a>
            </div>
            
            <div className="text-2xl mt-16 inline-block mr-0">
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleLogo}>HOME</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleTrending}>TRENDING</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleFriends}>FRIENDS</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleAccount}>ACCOUNT</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0" onClick={handleSettings}>SETTINGS</h3>
                <h3 className="ml-5 mt-12 cursor-pointer hover:text-3xl hover:mr-0 text-red-600" onClick={handleLogout}>LOGOUT</h3>
            </div>
        </div>
      )
}

export default VerticalHeader