import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import Loading from '../components/loading'
import VerticalHeader from '../components/verticalHeader'
import Error from '../components/error'
import PostList from '../components/postList'


const Account = () => {
    const [login, setLogin] = useState(false)
    const [posts, setPosts] = useState(null)
    const [user, setUser] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [following, setFollowing] = useState(null)
    const { id, view_id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken()
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
            const refresh = await refreshUserToken()
            if (refresh){
                navigate('/login')
            }

            await fetch('/account/' + id +'/' + view_id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
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

    if(user === null || posts === null){
        return <div><Loading></Loading></div>
    }

  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader user_id={view_id} account_id={id} view_id={view_id}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
        <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
        <div className="flex items-center">
        <p>{user.display_name} &#160;</p>
        <p className="text-lg text-gray-800">@{user.username}</p>
        </div>
        <h3 className="text-xl">{user.bio}</h3>
        {(id !== view_id)?<div className="text-base mt-1 mb-1 bg-black text-white rounded w-24 text-center cursor-pointer hover:bg-white hover:text-black border-2 border-black border-solid">{following?"Following":"Follow"}</div>:null}
        <PostList content={posts} user_id={id}></PostList>
        </div>
    </div>
  )
}

export default Account