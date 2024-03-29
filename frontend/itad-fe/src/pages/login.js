import React, { useState, useEffect } from 'react'
import Header from '../components/header'
import { useNavigate, Link } from 'react-router-dom'
import Error from '../components/error'
import Loading from '../components/loading'

const Login = () => {
  const[errorMsg, setErrorMsg] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(true)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

   useEffect(() => {
    const result = async () => {
      //await fetch('/auth/logout').then().then()
        try{
          await fetch('https://api.onetakeaday.com' + '/auth/login', {
              method: "POST",
              body: JSON.stringify({
                  username: username,
                  password: password
              }),
              headers: {
                  "Content-type": "application/json"
              },
              credentials: "include"
            }).then((response) => response.json()).
            then((json) => {
              setUserId(json.id)
              if (json.message === "already authorized"){
                  setValid(false)
              }else{
                setLoading(false)
              }

              //console.log(json)
              return () => {}
          })

          /* setLoading(false) */
    } catch (e) {
      return navigate('/error')
    }
        }
        result()
    }, [])

    if(!valid){
      return navigate("/home/" + userId)
    }


  async function handleLogin(e){
    e.preventDefault()
    if((username === '') || (password === '')){
      setErrorMsg("All fields are required")
    }else{
      await login()
    }
  }

  async function login(){
    try{
      await fetch(('https://api.onetakeaday.com' + '/auth/login'), {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
                "Content-type": "application/json"
        },
        credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        console.log(json)
        if(json.message === "unauthorized"){
          setErrorMsg('Username or Password is incorrect')
          setPassword('')
          setUsername('')
        }else if(json.message==="success"){
          setErrorMsg('')
          setUserId(json.id)
          return navigate("/home/" + json.id)
        }
      })
    } catch (e) {
      return navigate('/error')
    }
  }
  if(loading){
    return <div className="flex align-center justify-center m-auto">
      <Loading></Loading>
    </div>
  }
   return (
      <div className="">
        <div>
          <Header list={['REGISTER', 'ABOUT']}></Header>
        </div>
        <div className="flex justify-center mt-16 ml-4 mr-4">
        <div className="block justify-center w-auto">
          <h1 className="text-5xl">Login to account</h1>
          <div className="">
          <p className="mt-5 text-gray-700">Don't have one? <Link to="/register" className="text-blue-700 underline">Register</Link></p>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
          <div className="mt-3">
            <div>
              <label className="block">Username</label>
              <input type="text" className="w-96 border-0 border-b border-black h-8 focus:ring-0" key="email" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleLogin(e):''}></input>
            </div>
            <div className="mt-3">
              <label className="block">Password</label>
              <input type="password" className="w-96 border-0 border-b border-black h-8 focus:ring-0" key="pass1" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleLogin(e):''}></input>
            </div>
            <button className="mt-5 bg-black text-white w-96 h-11 rounded text-xl" onClick={handleLogin}>Login</button>
          </div>
          
        </div>
        </div>
      </div>
      </div>
    )
}

export default Login
