import React, { useState, useEffect } from 'react'
import VerticalHeader from '../components/verticalHeader'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import { useNavigate, useParams } from 'react-router-dom'
import Error from '../components/error'
import Loading from '../components/loading'


const PostPage = () => {
    const [date, setDate] = useState('')
    const [login, setLogin] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState(null)
    const [likeCount, setLikeCount] = useState(0)
    const [commentCount, setCommentCount] = useState(0)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            formatDate(new Date())
            const valid = await refreshUserToken()
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
            const refresh = await refreshUserToken()
            if (refresh){
                navigate('/login')
            }
            await fetch(('/comment/' + id))
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setPost(json.curr_post)
                    setComments(json.comments)
                    setLikeCount(json.curr_post.like_count)
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
    
  return (
    <div className="flex justify-between ">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
          <h1 className="text-right mb-2">{date}</h1>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>

        </div>
    </div>
  )
}

export default PostPage