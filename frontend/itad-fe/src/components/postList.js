import React from 'react'
import Post from '../components/post'

const PostList = ({ content, user_id }) => {

    return(
    <>
        { content?.map((post, index) => (
            <Post content={post} key={index} user_id={user_id}></Post>
        ))}
    </>
    )
  
}


export default PostList