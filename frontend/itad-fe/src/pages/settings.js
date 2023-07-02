import React, { useState, useEffect } from 'react'
import { refreshUserToken, checkCallback } from '../utilities/helper'
import { useParams, useNavigate } from 'react-router-dom'
import VerticalHeader from '../components/verticalHeader'
import Loading from '../components/loading'
import Error from '../components/error'

const Settings = () => {
    const [login, setLogin] = useState(false)
    const [bio, setBio] = useState(null)
    const [displayName, setDisplayName] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function effect(){
            const valid = await refreshUserToken(id)
            setLogin(valid)
            getSettings()
            return () => {}
        }
        effect()
    }, [])

    if (login){
        navigate('/login')
    }

    async function getSettings(){
        try{
            const refresh = await refreshUserToken(id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://onetakeaday.com' + '/settings/' + id, {
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 0){
                    setBio(json.user.bio)
                    setDisplayName(json.user.display_name)
                }else if(valid === 1){
                    navigate('/login')
                }
            })
        }catch{
            return navigate('/error')
        }
    }

    if (bio === null || displayName === null){
        return <div><Loading></Loading></div>
    }

    async function handleDisplayName(){
        try{
            const refresh = await refreshUserToken(id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://onetakeaday.com' + '/settings/display', {
                method: "PUT",
                body: JSON.stringify({
                    id: id,
                    displayName: displayName
                }),
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 1){
                    return navigate('/login')
                }else if(valid === 0){
                    window.location.reload(false)
                }
            })
        }catch(e){
            return navigate('/error')
        }
    }

    async function handleCompleteBtn(){
        try{
            const refresh = await refreshUserToken(id)
            if (refresh){
                navigate('/login')
            }

            await fetch('https://onetakeaday.com' + '/settings/bio', {
                method: "PUT",
                body: JSON.stringify({
                    id: id,
                    bio: bio
                }),
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include"
            })
            .then((res) => res.json())
            .then((json) => {
                const valid = checkCallback(json)
                if(valid === 1){
                    return navigate('/login')
                }else if(valid === 0){
                    window.location.reload(false)
                }
            })
        }catch(e){
            return navigate('/error')
        }
    }

  return (
    <div className="flex justify-between">
        <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css"></link>
        <VerticalHeader user_id={id} settings_id={0} trending_id={id} account_id={id} view_id={id} friend_id={id}></VerticalHeader>
        <div className="mr-20 mt-4 text-3xl w-full ml-32">
            <h1>SETTINGS</h1>
            <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
            <div className="mt-8">
              <label className="block text-2xl">Display Name</label>
              <input type="text" className="w-full border-0 border-b border-black h-8 focus:ring-0" placeholder="Enter Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleDisplayName(e):''}></input>
            </div>
            <div className="mt-8">
              <label className="block">Bio</label>
              <textarea className="w-full border-0 border-b border-r border-black focus:ring-0" placeholder="E.g. I like basketball, football, and tennis." key="bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
            </div>
            <button className=" bg-black text-white w-full h-11 rounded text-xl" onClick={handleCompleteBtn}>Edit Bio</button>
        </div>
    </div>
  )
}

export default Settings