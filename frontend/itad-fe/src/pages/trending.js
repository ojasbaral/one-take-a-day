import React, { useState, useEffect } from 'react'
import VerticalHeader from '../components/verticalHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import { AiOutlineSearch } from 'react-icons/ai'
import HashtagList from '../components/hashtagList'
import Loading from '../components/loading'
import PostList from '../components/postList'

const Trending = () => {
    const [search, setSearch] = useState('')
    const [login, setLogin] = useState(false)
    const [hashtags, setHashtags] = useState(null)
    const [posts, setPosts] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken(id)
            setLogin(valid)
            getTrending()
            return () => {}
        }
        effect()
    },[])

    if (login){
        navigate('/login')
    }

    async function getTrending(){
        try{    
            const refresh = await refreshUserToken(id)
            if (refresh){
                navigate('/login')
            }

            await fetch('http://api.onetakeaday.com/trending/' + id, {
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setHashtags(json.hashtags)
                    setPosts(json.posts)
                }else if(valid === 1){
                    return navigate('/login')
                }
            })
        }catch(e){
            //console.log(e)
            return navigate('/error')
        }
    }


    function handleKey(e){
        if(e.key === 'Enter'){
            if(search !== ''){
                navigate('/search/' + id + '/' + search + '/' + '1')
                window.location.reload(false)
            }
        }
    }

    if (hashtags === null || posts === null){
        return (
            <div><Loading></Loading></div>
        )
    }

  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader settings_id={id} user_id={id} account_id={id} view_id={id} friend_id={id} trending_id={0}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
        <div className="flex items-center"><input onKeyPress={(e) => handleKey(e)} type="text" className="w-full rounded-lg" placeholder="SEARCH FOR A HASHTAG" value={search} onChange={(e) => setSearch(e.target.value.replace(" ", ""))}></input><AiOutlineSearch className="cursor-pointer ml-2" onClick={search !== ''?() => navigate('/search/' + id + '/' + search):null}></AiOutlineSearch></div>
        <h1 className="mt-6">POPULAR HASHTAGS</h1>
        <HashtagList hashtags={hashtags} user_id={id}></HashtagList>
        <h1 className="mt-10">TODAYS MOST LIKED POSTS</h1>
            <PostList content={posts} user_id={id}></PostList>
        </div>

    </div>
  )
}

export default Trending