import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/loading'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import VerticalHeader from '../components/verticalHeader'
import PostList from '../components/postList'
import { AiOutlineSearch } from 'react-icons/ai'

const HashtagPage = () => {
    const [posts, setPosts] = useState(null)
    const [hashtag, setHashtag] = useState(null)
    const [search, setSearch] = useState('')
    const { hashtag_id, id } = useParams()
    const [login, setLogin] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken(id)
            setLogin(valid)
            getHashtag()
            return () => {}
        }
        effect()
    }, [])

    if (login){
        navigate('/login')
    }

    async function getHashtag(){
        try{    
            const refresh = await refreshUserToken(id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://api.onetakeaday.com' + '/hashtag/' + hashtag_id + '/' + id, {
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setPosts(json.posts)
                    setHashtag(json.hashtag)
                }else if(valid === 1){
                    return navigate('/login')
                }
            })
            
        }catch(e){
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

    function handleSearch(){
        if(search !== ''){
            navigate('/search/' + id + '/' + search + '/' + '1')
            window.location.reload(false)
        }
    }

    if(hashtag === null || posts === null){
        return ( <div><Loading></Loading></div>)
    }

  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader settings_id={id} user_id={id} account_id={id} view_id={id} friend_id={id} trending_id={id} hashtag_id={0}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-2">
        <div className="flex items-center mb-4"><input onKeyPress={(e) => handleKey(e)} type="text" className="w-full rounded-lg" placeholder="SEARCH FOR A HASHTAG" value={search} onChange={(e) => setSearch(e.target.value.replace(" ", ""))}></input><AiOutlineSearch className="cursor-pointer ml-2" onClick={handleSearch}></AiOutlineSearch></div>
            <h1>{hashtag.toUpperCase()}</h1>
            <PostList content={posts} user_id={id}></PostList>
        </div>
    </div>
  )
}

export default HashtagPage