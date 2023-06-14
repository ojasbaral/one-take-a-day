import React from 'react'

const Hashtag = ({ hashtag_id, hashtag }) => {
  return (
    <div className="whitespace-nowrap text-base ml-2 bg-black text-white rounded-md py-[1px] px-2 cursor-pointer hover:bg-white hover:text-black border-2 border-black border-solid">#{hashtag}</div>
  )
}

export default Hashtag