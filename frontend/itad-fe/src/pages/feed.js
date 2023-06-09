import React, { useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import VerticalHeader from '../components/verticalHeader'
import Error from '../components/error'
import { refreshUserToken, checkCallback} from '../utilities/helper'

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
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(()=> {
    formatDate(new Date())
  }, [])

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
    setNewPost('')
    setHashtags([])
    window.location.reload(false)
    }
  }

async function addPost(){
  try{
      const refresh = await refreshUserToken()
      if (refresh){
        navigate('/login')
      }

      await fetch('/post', {
          method: "POST",
          body: JSON.stringify({
            content: newPost,
            user_id: id,
            hashtags: hashtags
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      }).then((res) => res.json())
      .then((json) => {
        if(json.message === "already posted"){
          setErrorMsg('You have already posted today')
        }else{

          const valid = checkCallback(json)

          if(valid === 0){
              //GET THE POSTS
          }else if(valid === 1){
              navigate('/login')
          }
        }
      })
  }catch(e){
      console.log(e)
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

  return (
    <div className="flex justify-between ">
      <VerticalHeader></VerticalHeader>
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
      </div>
    </div>
  )
}

export default Feed