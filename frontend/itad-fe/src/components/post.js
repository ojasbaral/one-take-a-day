import React, { useState, useEffect} from 'react'
import HashtagList from '../components/hashtagList'
import { AiOutlineFire, AiOutlineComment, AiFillFire, AiOutlineDelete } from "react-icons/ai"
import Loading from '../components/loading'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import { useNavigate } from 'react-router-dom'

const Post = ({ content, user_id, owned }) => {
  const [liked, setLiked] = useState(content.liked)
  const [likeCount, setLikeCount] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(content.liked)
    setLikeCount(content.like_count)
  }, [])

  
  async function delLike(){
    try{
      const refresh = await refreshUserToken()
      if (refresh){
        navigate('/login')
      }

      await fetch("/like", {
        method: "DELETE",
        body: JSON.stringify({
          post_id: content.post_id,
          user_id: user_id
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
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
      const refresh = await refreshUserToken()
      if (refresh){
        navigate('/login')
      }

      await fetch('/like', {
        method: "POST",
        body: JSON.stringify({
          post_id: content.post_id,
          user_id: user_id
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
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

  async function delPost(){
    try{
      const refresh = await refreshUserToken()
        if (refresh){
          navigate('/login')
        }
  
        await fetch('/post', {
          method: "DELETE",
          body: JSON.stringify({
            post_id: content.post_id
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then((res) => res.json())
        .then((json) => {
          const valid = checkCallback(json)
          if(valid === 0){
            window.location.reload(false)
          }else if(valid === 1){
            navigate('/login')
          }
        })
    }catch (e){
      return navigate('/error')
    }
  }
  
  if(liked === null){
    return <div><Loading></Loading></div>
  }

  return (
    <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded">
            <div className="flex mt-1 ml-1 mr-1 justify-between content-center">
            <p className="text-xl float-left cursor-pointer hover:font-bold hover:text-blue-600">{content.display_name}</p>
            <p className="text-base float-right">{content.posted.toString().slice(0,10)}</p>
            </div>
            <h6 className="text-base ml-2 -mt-1 text-gray-700">@{content.username}</h6>
            <p className="ml-2 text-base mt-1">{content.content}</p>
            <HashtagList hashtags={content.hashtags}></HashtagList>
            <div className="flex justify-left mb-2 mt-2">
              <a className="flex ml-2"><p className="text-base mr-1">{likeCount}</p>{liked?<AiFillFire size={23} className="cursor-pointer hover:text-red-700" color="red" onClick={delLike}></AiFillFire>:<AiOutlineFire size={23} className="cursor-pointer hover:text-red-700" onClick={addLike}></AiOutlineFire>}</a>
              <a className="flex ml-5"><p className="text-base mr-1">{content.comment_count}</p><AiOutlineComment size={23} className="cursor-pointer hover:text-red-700" onClick={() => navigate('/post/' + content.post_id + '/' + user_id)}></AiOutlineComment></a>
              {owned?<a><AiOutlineDelete size={23} className="ml-5 cursor-pointer hover:text-red-700 float-right" onClick={delPost}></AiOutlineDelete></a>:null}
            </div>
          </div>
  )
}

export default Post