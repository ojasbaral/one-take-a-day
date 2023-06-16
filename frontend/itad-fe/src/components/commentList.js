import React from 'react'
import Comment from '../components/comment'

const CommentList = ({ comments, user_id }) => {
  return (
    <>
    {comments?.map((comment, index) => (
        <Comment user_id={user_id} comment={comment} key={index} ></Comment>
    ))}
    </>
  )
}

export default CommentList