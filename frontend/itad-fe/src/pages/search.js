import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { refreshUserToken, checkCallback} from '../utilities/helper'
import VerticalHeader from '../components/verticalHeader'
import { AiOutlineSearch } from 'react-icons/ai'
import FriendsList from '../components/friendsList'
import Loading from '../components/loading'

const Search = () => {
    const { id, word } = useParams()
    const [search, setSearch] = useState(word)
    const [login, setLogin] = useState(false)
    const [resp, setResp] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken()
            setLogin(valid)
            getSearch()
            return () => {}
        }
        effect()
    }, [])

    if (login){
        navigate('/login')
    }

    async function getSearch(){
        try{
            const refresh = await refreshUserToken()
            if (refresh){
                navigate('/login')
            }
            await fetch('/search/' + search)
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setResp(json.queries)
                }else if(valid === 1){
                    return navigate('/login')
                }
            })

        }catch{
            return navigate('/error')
        }
    }

    function handleSearch(){
        if(search !== ''){
            navigate('/search/' + id + '/' + search)
            window.location.reload(false)
        }
    }

    function handleKey(e){
        if(e.key === 'Enter'){
            if(search !== ''){
                navigate('/search/' + id + '/' + search)
                window.location.reload(false)
            }
        }
    }

  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader user_id={id} account_id={id} view_id={id} friend_id={id} search_id={0}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
        <div className="flex items-center"><input onKeyPress={(e) => handleKey(e)} type="text" className="w-full rounded-lg" placeholder="SEARCH FOR A USERNAME" value={search} onChange={(e) => setSearch(e.target.value.replace(" ", ""))}></input><AiOutlineSearch className="cursor-pointer ml-2" onClick={handleSearch}></AiOutlineSearch></div>
        {resp === null?<div><Loading></Loading></div>:<FriendsList following={false} list={resp}></FriendsList>}
        {resp?.length === 0?<h1>NO USERS MATCH YOUR SEARCH</h1>:null}
        </div>
    </div>
  )
}

export default Search