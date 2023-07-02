import React, { useState, useEffect } from 'react'
import VerticalHeader from '../components/verticalHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import Loading from '../components/loading'
import FriendsList from '../components/friendsList'

const Friends = () => {
    const [following, setFollowing] = useState(true)
    const [followingList, setFollowingList] = useState(null)
    const [followerList, setFollowerList] = useState(null)
    const [login, setLogin] = useState(false)
    const [search, setSearch] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken(id)
            setLogin(valid)
            getFriends()
            return () => {}
        }
        effect()
    }, [])

    if (login){
        navigate('/login')
    }

    async function getFriends(){
        try{
            const refresh = await refreshUserToken(id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://api.onetakeaday.com' + '/friend/' + id, {
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setFollowingList(json.following)
                    setFollowerList(json.followers)
                }else if(valid === 1){
                    navigate('/login')
                }
            })
        }catch{
            return navigate('/error')
        }
    }

    function handleKey(e){
        if(e.key === 'Enter'){
            if(search !== ''){
                navigate('/search/' + id + '/' + search + '/' + '0')
                window.location.reload(false)
            }
        }
    }

    if (followingList === null || followerList === null){
        return <div><Loading></Loading></div>
    }


  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader user_id={id} settings_id={id} trending_id={id} account_id={id} view_id={id} friend_id={0}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-2">
            <div className="flex items-center"><input onKeyPress={(e) => handleKey(e)} type="text" className="w-full rounded-lg" placeholder="SEARCH FOR A USERNAME" value={search} onChange={(e) => setSearch(e.target.value.replace(" ", ""))}></input><AiOutlineSearch className="cursor-pointer ml-2" onClick={search !== ''?() => navigate('/search/' + id + '/' + search):null}></AiOutlineSearch></div>
            <div className="flex text-3xl mt-4 font-extrabold items-center text-black"><h1 onClick={following?null:() => setFollowing(true)} className={following?"mr-2":"cursor-pointer text-2xl mr-2 text-gray-600 hover:text-black"}>FOLLOWING</h1><h1 className={following?"cursor-pointer text-2xl ml-2 text-gray-600 hover:text-black":"ml-2"} onClick={following?() => setFollowing(false):null}>FOLLOWERS</h1></div>

            <FriendsList following={following} list={following?followingList:followerList}></FriendsList>
            
        </div>
    </div>
  )
}

export default Friends