import React from 'react'
import Following from '../components/following'
import Follower from '../components/follower'

const FriendsList = ({ following, list }) => {
    if(following){
        return (
            <div className="ml-2 mt-2">
                {list?.map((user, index) => (
                    <Following key={index} user={user}></Following>
                ))}
            </div>
        )
        }
    return (
        <div className="ml-2 mt-2">
            {list?.map((user, index) => (
                <Follower key={index} user={user}></Follower>
            ))}
        </div>
    )
}


export default FriendsList