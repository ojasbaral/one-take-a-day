import React from 'react'
import Hashtag from '../components/hashtag'

const HashtagList = ({ hashtags, user_id }) => {
  return (
    <div className="w-auto flex items-center mb-1 overflow-auto whitespace-nowrap mr-2 mt-2">
        {hashtags?.map((hashtag, index) => (
            <Hashtag user_id={user_id} key={index} hashtag_id={hashtag.hashtag_id} hashtag={hashtag.hashtag}></Hashtag>
        ))}
    </div>
  )
}

export default HashtagList