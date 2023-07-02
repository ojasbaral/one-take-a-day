import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import Loading from '../components/loading'
import VerticalHeader from '../components/verticalHeader'
import Error from '../components/error'
import PostList from '../components/postList'
import { AiOutlineSearch } from 'react-icons/ai'


const Account = () => {
    const [login, setLogin] = useState(false)
    const [posts, setPosts] = useState(null)
    const [user, setUser] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [search, setSearch] = useState('')
    const [following, setFollowing] = useState(null)
    const { id, view_id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken(view_id)
            setLogin(valid)
            getAccount()
            return () => {}
        }
        effect()
    }, [])

    if (login){
        navigate('/login')
    }

    async function getAccount(){
        try{
            const refresh = await refreshUserToken(view_id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://onetakeaday.com' + '/account/' + id +'/' + view_id, {
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setFollowing(json.following)
                    setPosts(json.posts)
                    setUser(json.user)
                }else if(valid === 1){
                    return navigate('/login')
                }
            })
        }catch{
            return navigate('/error')
        }
    }

    function handleFollowBtn(){
        if(following){
            unfollow()
        }else{
            follow()
        }
        //window.location.reload(false)
    }

    async function follow(){
        try{
            const refresh = await refreshUserToken(view_id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://onetakeaday.com' + '/friend', {
                method: "POST",
                body: JSON.stringify({
                    follower: view_id,
                    following: id
                }),
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            }).then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setFollowing(true)
                }else if(valid === 1){
                    navigate('/login')
                }
            })
        }catch(e){
            return navigate('/error')
        }
    }

    async function unfollow(){
        try{
            const refresh = await refreshUserToken(view_id)
            if (refresh){
                navigate('/login')
            }
            
            await fetch('https://onetakeaday.com' + '/friend', {
                method: "DELETE",
                body: JSON.stringify({
                    follower: view_id,
                    following: id
                }),
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            }).then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setFollowing(false)
                }else if(valid === 1){
                    navigate('/login')
                }
            })
        }catch(e){
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

    function handleSearch(){
        if(search !== ''){
            navigate('/search/' + id + '/' + search + '/' + '0')
            window.location.reload(false)
        }
    }

    if(user === null || posts === null){
        return <div><Loading></Loading></div>
    }

  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader trending_id={view_id} user_id={view_id} account_id={id} view_id={view_id} friend_id={view_id} settings_id={view_id}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
        <div className="flex items-center mb-4"><input onKeyPress={(e) => handleKey(e)} type="text" className="w-full rounded-lg" placeholder="SEARCH FOR A USERNAME" value={search} onChange={(e) => setSearch(e.target.value.replace(" ", ""))}></input><AiOutlineSearch className="cursor-pointer ml-2" onClick={handleSearch}></AiOutlineSearch></div>
        <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
        <div className="flex items-center">
        <p>{user.display_name} &#160;</p>
        <p className="text-lg text-gray-800">@{user.username}</p>
        </div>
        <h3 className="text-xl">{user.bio}</h3>
        {(id !== view_id)?<div className="text-base mt-1 mb-1 bg-black text-white rounded w-24 text-center cursor-pointer hover:bg-white hover:text-black border-2 border-black border-solid" onClick={handleFollowBtn}>{following?"Following":"Follow"}</div>:null}
        {posts.length === 0?<h1 className="mt-4">THIS USER HAS NO POSTS</h1>:null}
        <PostList content={posts} user_id={view_id} owned={id === view_id}></PostList>
        
        </div>
    </div>
  )
}

export default Account