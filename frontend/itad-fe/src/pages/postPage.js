import React, { useState, useEffect } from 'react'
import VerticalHeader from '../components/verticalHeader'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import { useNavigate, useParams } from 'react-router-dom'
import Error from '../components/error'
import Loading from '../components/loading'
import HashtagList from '../components/hashtagList'
import CommentList from '../components/commentList'
import { AiOutlineFire, AiOutlineComment, AiOutlineDelete, AiFillFire } from "react-icons/ai"

const PostPage = () => {
    const [date, setDate] = useState('')
    const [login, setLogin] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState(null)
    const [likeCount, setLikeCount] = useState(0)
    const [comment, setComment] = useState('')
    const [liked, setLiked] = useState(null)
    const [commentCount, setCommentCount] = useState(0)
    const [hashtags, setHashtags] = useState([])
    const [own, setOwn] = useState(false)
    const { id, user_id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            formatDate(new Date())
            const valid = await refreshUserToken(user_id)
            setLogin(valid)
            getComments()
            return () => {}
        }
        effect()
    }, [])

    if (login){
        navigate('/login')
    }

    async function getComments(){
        try{
            const refresh = await refreshUserToken(user_id)
            if (refresh){
                navigate('/login')
            }
            await fetch(('https://one-take-a-day-backend.onrender.com/comment/' + id + '/' + user_id))
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setPost(json.curr_post)
                    setComments(json.comments)
                    setLikeCount(json.curr_post.like_count)
                    setLiked(json.liked)
                    setHashtags(json.hashtags)
                    if(user_id.toString() === json.curr_post.account_id.toString()){
                        setOwn(true)
                    }
                }else if(valid === 1){
                    return navigate('/login')
                }
            })
        }catch(e){
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

      if(post === null){
        return <div><Loading></Loading></div>
      }

      async function delLike(){
        try{
          const refresh = await refreshUserToken(user_id)
          if (refresh){
            navigate('/login')
          }
    
          await fetch("https://one-take-a-day-backend.onrender.com/like", {
            method: "DELETE",
            body: JSON.stringify({
              post_id: id,
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
          const refresh = await refreshUserToken(user_id)
          if (refresh){
            navigate('/login')
          }
    
          await fetch('https://one-take-a-day-backend.onrender.com/like', {
            method: "POST",
            body: JSON.stringify({
              post_id: id,
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
          const refresh = await refreshUserToken(user_id)
            if (refresh){
              navigate('/login')
            }
      
            await fetch('https://one-take-a-day-backend.onrender.com/post', {
              method: "DELETE",
              body: JSON.stringify({
                post_id: id
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then((res) => res.json())
            .then((json) => {
              const valid = checkCallback(json)
              if(valid === 0){
                return navigate('/home/' + user_id)
              }else if(valid === 1){
                navigate('/login')
              }
            })
        }catch (e){
          return navigate('/error')
        }
      }

      function handleComment(){
        if(comment === '') {
            setErrorMsg("Comments must be at least one character")
            setComment('')
        }else if(comment.length > 200){
            setErrorMsg("Comments must be 200 or less characters")
            setComment('')
        }else{
            addComment()
            setComment('')
        }
      }

      async function addComment(){
        try{
            const refresh = await refreshUserToken(user_id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://one-take-a-day-backend.onrender.com/comment', {
                method: "POST",
                body: JSON.stringify({
                    post_id: id,
                    user_id: user_id,
                    comment: comment
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setCommentCount(commentCount + 1)
                    getComments()
                }else if(valid === 1){
                    navigate('/login')
                }
            })
        }catch{
            return navigate('/error')
        }
      }
    
  return (
    <div className="flex justify-between ">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader settings_id={user_id} trending_id={user_id} user_id={user_id} account_id={user_id} view_id={user_id} friend_id={user_id}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
          <h1 className="text-right mb-2">{date}</h1>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>

          <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded">
            <div className="flex mt-1 ml-1 mr-1 justify-between post-center">
            <p className="text-xl float-left cursor-pointer hover:font-bold hover:text-blue-600">{post.display_name}</p>
            <p className="text-base float-right">{post.posted.toString().slice(0,10)}</p>
            </div>
            <h6 className="text-base ml-2 -mt-1 text-gray-700">@{post.username}</h6>
            <p className="ml-2 text-base mt-1">{post.content}</p>
            <HashtagList hashtags={hashtags}></HashtagList>
            <div className="flex justify-left mb-2 mt-2">
              <a className="flex ml-2"><p className="text-base mr-1">{likeCount}</p>{liked?<AiFillFire size={23} className="cursor-pointer hover:text-red-700" color="red" onClick={delLike}></AiFillFire>:<AiOutlineFire size={23} className="cursor-pointer hover:text-red-700" onClick={addLike}></AiOutlineFire>}</a>
              <a className="flex ml-5"><p className="text-base mr-1">{post.comment_count}</p><AiOutlineComment size={23} className=""></AiOutlineComment></a>
              {own?<a><AiOutlineDelete size={23} className="ml-5 cursor-pointer hover:text-red-700 float-right" onClick={delPost}></AiOutlineDelete></a>:null}
            </div>
          </div>

          <h1 className="mt-2 mb-2">Comments</h1>

          <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded">
          <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full border-0 h-16 resize-none focus:ring-0" placeholder="WRITE A COMMENT..."></textarea>
            <div className="flex">
          <button onClick={handleComment} className="bg-black text-white w-full h-8 m-1 rounded text-xl hover:bg-white hover:text-black hover:border-2 hover:border-black hover:border-solid float-right">COMMENT</button>
            </div>
          </div>

            <CommentList comments={comments} user_id={user_id}></CommentList>

        </div>
    </div>
  )
}

export default PostPage