import React, { useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import VerticalHeader from '../components/verticalHeader'
import Error from '../components/error'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import { AiOutlineFire, AiOutlineComment, AiOutlineDelete, AiFillFire } from "react-icons/ai"
import Loading from '../components/loading'
import HashtagList from '../components/hashtagList'
import PostList from '../components/postList'

/* ----------------------------------------------------------------------------- */
/* MAKE SURE TO FETCH POSTS AFTER ADDING A POST                                                                              */
/* ----------------------------------------------------------------------------- */

const Feed = () => {
  const [date, setDate] = useState('')
  const [newPost, setNewPost] = useState('')
  const [addHashtag, setAddHashtag] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const [currentHashtag, setCurrentHashtag] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [page, setPage] = useState(1)
  const [noFeed, setNoFeed] = useState(false)
  const [posts, setPosts] = useState(null)
  const [posted, setPosted] = useState(false)
  const [login, setLogin] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(()=> {
    async function effect(){
      formatDate(new Date())
      const valid = await refreshUserToken(id)
      setLogin(valid)
      getPosts()
      return () => {}
    }
    effect()
  }, [])

  if (login){
    navigate('/login')
}

  async function getPosts(){
    try{
      const refresh = await refreshUserToken(id)
      if (refresh){
        navigate('/login')
      }
      await fetch(('https://one-take-a-day-backend.onrender.com/post/' + id + '/' + page.toString()), {
        credentials: "include"
      })
      .then((res) => res.json())
      .then((json) => {
          const valid = checkCallback(json)
          if(valid === 0){
              if ((json.content === []) && (page === 1)){
                setNoFeed(true)
                setPosted(json.posted)
              }else{
                if(posts === null){
                  setPosts([])
                }
                setPage(page + 1)
                setPosts(posts => [...posts, ...json.content])
                setPosted(json.posted)
              }

              if(json.posted){
                setCurrentPost(json.current_post)
                setLiked(json.current_liked)
                setLikeCount(json.current_post.like_count)
              }else{
                setCurrentPost([])
              }
          }else if(valid === 1){
              navigate('/login')
          }
        
      })
    }catch (e){
      return navigate('/error')
    }
  }


  function formatDate(uDate){
    const day = uDate.getDay()
    const month = uDate.getMonth()
    const d = uDate.getDate()

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const temp = days[day] + ', ' + months[month] + ' ' + d
    setDate(temp.toUpperCase())
  }

  function handlePost(){
    if(newPost.length > 255){
      setErrorMsg("Posts must be 255 characters or less")
      setNewPost('')
    }else if(newPost.length === 0){
      setErrorMsg("Posts must be at least one character")
      setNewPost('')
    }else{
    addPost()
    }
  }

async function delPost(){
  try{
    const refresh = await refreshUserToken(id)
      if (refresh){
        navigate('/login')
      }

      await fetch('https://one-take-a-day-backend.onrender.com/post', {
        method: "DELETE",
        body: JSON.stringify({
          post_id: currentPost.post_id
        }),
        headers: {
          "Content-type": "application/json"
        },
        credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        const valid = checkCallback(json)
        if(valid === 0){
          setPosted(false)
        }else if(valid === 1){
          navigate('/login')
        }
      })
  }catch (e){
    return navigate('/error')
  }
}

async function addPost(){
  try{
      const refresh = await refreshUserToken(id)
      if (refresh){
        navigate('/login')
      }

      console.log("test")


      await fetch('https://one-take-a-day-backend.onrender.com/post', {
          method: "POST",
          body: JSON.stringify({
            content: newPost,
            user_id: id,
            hashtags: hashtags
          }),
          headers: {
              "Content-type": "application/json"
          },
          credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        if(json.message === "already posted"){
          setErrorMsg('You have already posted today')
        }else{

          const valid = checkCallback(json)

          if(valid === 0){
            setPosted(true)
            getPosts()
            setNewPost('')
            setHashtags([])
          }else if(valid === 1){
              navigate('/login')
          }
        }
      })
  }catch(e){
      return navigate('/error')
  }
  }

  async function delLike(){
    try{
      const refresh = await refreshUserToken(id)
      if (refresh){
        navigate('/login')
      }

      await fetch("https://one-take-a-day-backend.onrender.com/like", {
        method: "DELETE",
        body: JSON.stringify({
          post_id: currentPost.post_id,
          user_id: id
        }),
        headers: {
          "Content-type": "application/json"
        },
        credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        const valid = checkCallback(json)

        if(valid === 0){
          setLiked(false)
          setLikeCount(likeCount - 1)
        }else if(valid === 1){
          navigate('/login')
        }
      })

    }catch(e){
      return navigate('/error')
  }
  }

  async function addLike(){
    try{
      const refresh = await refreshUserToken(id)
      if (refresh){
        navigate('/login')
      }

      await fetch('https://one-take-a-day-backend.onrender.com/like', {
        method: "POST",
        body: JSON.stringify({
          post_id: currentPost.post_id,
          user_id: id
        }),
        headers: {
          "Content-type": "application/json"
        },
        credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        const valid = checkCallback(json)
        if(valid === 0){
          setLiked(true)
          setLikeCount(likeCount + 1)
        }else if(valid === 1){
          navigate('/login')
        }
      })
    }catch(e){
      return navigate('/error')
    }
  }

  function handleKeyPress(e){
    if (e.key === 'Space'){
      return false
    }
    if (e.key === 'Escape'){
      setAddHashtag(false)
    }

    if (e.key === 'Enter'){
      if(currentHashtag === ''){
        setErrorMsg("Hashtags must be at least one character")
        setCurrentHashtag('')
      }else if(currentHashtag.length < 51){
        setHashtags(hashtags => [...hashtags, currentHashtag])
        setCurrentHashtag('')
      }else{
        setErrorMsg("Hashtags can only be 50 characters")
        setCurrentHashtag('')
      }
    }
  }

  function deleteHashtag(hashtag){
    const new_array = []
    for (const i of hashtags){
      if (i !== hashtag){
        new_array.push(i)
      }
    }
    setHashtags(new_array)
  }

  if((currentPost === null) || (posts === null)){
    return <div><Loading></Loading></div>
  }else{
  if (posted){
    return (
      <div className="flex justify-between ">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader settings_id={id} user_id={0} account_id={id} view_id={id} friend_id={id} trending_id={id}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
          <h1 className="text-right mb-2">{date}</h1>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
          
          <h1>ONLY ONE TAKE A DAY...</h1>
          <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded">
            <div className="flex mt-1 ml-1 mr-1 justify-between content-center">
            <p className="text-xl float-left cursor-pointer hover:font-bold hover:text-blue-600">{currentPost.display_name}</p>
            <p className="text-base float-right">{currentPost.posted.toString().slice(0,10)}</p>
            </div>
            <h6 className="text-base ml-2 -mt-1 text-gray-700">@{currentPost.username}</h6>
            <p className="ml-2 text-base mt-1">{currentPost.content}</p>
            <HashtagList hashtags={currentPost.hashtags} user_id={id}></HashtagList>
            <div className="flex justify-left mb-2 mt-2">
            <a className="flex ml-2"><p className="text-base mr-1">{likeCount}</p>{liked?<AiFillFire size={23} className="cursor-pointer hover:text-red-700" color="red" onClick={delLike}></AiFillFire>:<AiOutlineFire size={23} className="cursor-pointer hover:text-red-700" onClick={addLike}></AiOutlineFire>}</a>
            <a className="flex ml-5"><p className="text-base mr-1">{currentPost.comment_count}</p><AiOutlineComment size={23} className="cursor-pointer hover:text-red-700" onClick={() => navigate('/post/' + currentPost.post_id  + '/' + id)}></AiOutlineComment></a>
              <a><AiOutlineDelete size={23} className="ml-5 cursor-pointer hover:text-red-700 float-right" onClick={delPost}></AiOutlineDelete></a>
            </div>
          </div>

        <PostList content={posts} user_id={id} owned={false}></PostList>

        <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded mb-2">
            <h1 className="text-center m-1">No More Posts</h1>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-between ">
      <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
      <VerticalHeader user_id={0} settings_id={id} account_id={id} view_id={id} friend_id={id} trending_id={id}></VerticalHeader>
      <div className="mr-20 mt-4 text-3xl w-full ml-32">
        <h1 className="text-right mb-2">{date}</h1>
        <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
        
        <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded">
        <textarea className="w-full border-0 h-24 resize-none focus:ring-0" placeholder="ONLY ONE TAKE A DAY, MAKE IT COUNT..." value={newPost} onChange={(e) => setNewPost(e.target.value)}></textarea>
        <div className="flex">
        {addHashtag? <button onClick={() => setAddHashtag(true)} className="w-auto pl-2 pr-2 rounded h-8 border-black border-solid border-2 ml-1 text-xl whitespace-nowrap float-left"><p className="block">{addHashtag? <div className="flex items-center"><p className="float-left">#</p><input onChange={(e) => setCurrentHashtag(e.target.value.replace(" ", ""))} value={currentHashtag} placeholder="basketball" className="text-base ml-1 float-left w-3/4 border-0 focus:ring-0 focus:outline-none mr-0 pr-0" onKeyDown={handleKeyPress}></input></div>: "+ HASHTAGS"}</p></button>: <button onClick={() => setAddHashtag(true)} className="w-auto pl-2 pr-2 rounded h-8 border-black border-solid border-2 ml-1 text-xl hover:bg-black hover:text-white whitespace-nowrap float-left"><p className="block">{addHashtag? <div className="flex items-center"><p className="float-left">#</p><input onChange={(e) => setCurrentHashtag(e.target.value)} value={currentHashtag} placeholder="basketball" className="text-base ml-1 float-left w-3/4 border-0 focus:ring-0 focus:outline-none mr-0 pr-0" onKeyDown={handleKeyPress}></input></div>: "+ HASHTAGS"}</p></button>}
        <div className="w-full flex items-center mb-1 overflow-auto whitespace-nowrap mr-2">
          {hashtags.map((hashtag, index) => (
            <div key={index} className="whitespace-nowrap text-base ml-2 bg-black text-white rounded-md py-[1px] px-2 cursor-pointer hover:bg-white hover:text-black border-2 border-black border-solid">#{hashtag} &#160;&#160;<a onClick={() => deleteHashtag(hashtag)} className="inline text-red-600 hover:font-extrabold">&#10006;</a></div>
          ))}
        </div>
        <button className="bg-black text-white w-1/5 h-8 rounded text-xl mr-1 mb-1 hover:bg-white hover:text-black hover:border-2 hover:border-black hover:border-solid float-right" onClick={handlePost}>POST</button>
        </div>
        </div>
        <PostList content={posts} user_id={id} owned={false}></PostList>

        <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded mb-2">
            <h1 className="text-center m-1">No More Posts</h1>
          </div>

      </div>
    </div>
  )
} 
}

export default Feed