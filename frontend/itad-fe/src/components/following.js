import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
import { refreshUserToken, checkCallback} from '../utilities/helper'

const Following = ({ user }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    async function delFriend(){
        try{
            const refresh = await refreshUserToken()
            if (refresh){
              navigate('/login')
            }

            await fetch('/friend', {
                method: "DELETE",
                body: JSON.stringify({
                    follower: id,
                    following: user.user_id
                }),
                headers: {      
                    "Content-type": "application/json; charset=UTF-8"
                  }
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    window.location.reload(false)
                }else if (valid === 1){
                    return navigate('/login')
                }
            })
        }catch{
            return navigate('/error')
        }
    }

  return (
    <div className="flex items-center mt-3 justify-between"><div className="flex"><h1 className="mr-2 text-2xl cursor-pointer hover:text-blue-600" onClick={() => navigate('/account/' + user.user_id + '/' + id)}>{user.display_name}</h1><h1 className="text-lg">@{user.username}</h1></div><AiOutlineClose size={23} color="red" className="cursor-pointer" onClick={delFriend}></AiOutlineClose></div>
  )
}

export default Following