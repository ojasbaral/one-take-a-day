import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Follower = ({ user }) => {
    const {id} = useParams()
    const navigate = useNavigate()

  return (
    <div className="flex items-center mt-3 justify-between"><div className="flex"><h1 className="mr-2 text-2xl cursor-pointer hover:text-blue-600" onClick={() => navigate('/account/' + user.user_id + '/' + id)}>{user.display_name}</h1><h1 className="text-lg">@{user.username}</h1></div></div>
  )
}

export default Follower