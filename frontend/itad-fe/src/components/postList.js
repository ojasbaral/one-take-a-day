import React from 'react'
import Post from '../components/post'

const PostList = ({ content, user_id, owned }) => {

    return(
    <>
        { content?.map((post, index) => (
            <Post content={post} key={index} user_id={user_id} owned={owned}></Post>
        ))}
    </>
    )
  
}


export default PostList