import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hashtag = ({ hashtag_id, hashtag, user_id }) => {
  const navigate = useNavigate()

  function handleClick(){
    navigate('/hashtag/' + hashtag_id + '/' + user_id)
    window.location.reload(false)
  }

  return (
    <div onClick={handleClick} className="whitespace-nowrap text-base ml-2 bg-black text-white rounded-md py-[1px] px-2 cursor-pointer hover:bg-white hover:text-black border-2 border-black border-solid">#{hashtag}</div>
  )
}

export default Hashtag