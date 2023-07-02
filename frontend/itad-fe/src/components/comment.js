import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {AiOutlineDelete} from "react-icons/ai"
import { refreshUserToken, checkCallback} from '../utilities/helper'


const Comment = ({ comment, user_id }) => {
    const [owned, setOwned] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        
        if (user_id.toString() === comment.account_id.toString()){
            setOwned(true)
        }
    }, [])

    async function delComment(){
        try{
            const refresh = await refreshUserToken(user_id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://onetakeaday.com' + '/comment', {
                method: "DELETE", 
                body: JSON.stringify({
                    post_id: comment.post_id,
                    user_id: user_id,
                    comment: comment.comment
                }),
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            }).then((res) => res.json())
            .then((json) => {
                console.log(json)
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
    <div className="w-auto h-auto border-black border-solid border-2 mt-2 rounded">
       <div className="flex m-1 mb-0 justify-between"> <div className="flex"><p className="text-xl">{comment.display_name} &#160;</p><p className="text-base text-gray-800">@{comment.username}</p></div>{owned?<AiOutlineDelete size={23} onClick={delComment} className="hover:text-red-700 cursor-pointer"></AiOutlineDelete>:null}</div>
       <h1 className="text-base ml-1 mb-1">{comment.comment}</h1>
    </div>
  )
}

export default Comment