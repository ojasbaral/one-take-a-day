import React, { useState, useEffect } from 'react'
import Header from '../components/header'
import { useNavigate, Link } from 'react-router-dom'
import Error from '../components/error'

const Login = () => {
  const[errorMsg, setErrorMsg] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(true)
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()

   useEffect(() => {
    const result = async () => {
        try{
          await fetch('/auth/login', {
              method: "POST",
              body: JSON.stringify({
                  username: username,
                  password: password
              }),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
            }).then((response) => response.json()).
            then((json) => {
              setUserId(json._id)
              if (json.message === "already authorized"){
                  setValid(false)
              }
              //console.log(json)
              return () => {}
          })
    } catch (e) {
      return navigate('/error')
    }
        }
        result()
    }, [])

    if(!valid){
      return navigate("/home")
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
      await fetch(('/auth/login'), {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
                "Content-type": "application/json; charset=UTF-8"
        }
      }).then((res) => res.json())
      .then((json) => {
        if(json.message === "unauthorized"){
          setErrorMsg('Username or Password is incorrect')
          setPassword('')
          setUsername('')
        }else if(json.message==="success"){
          setErrorMsg('')
          return navigate("/home")
        }
      })
    } catch (e) {
      return navigate('/error')
    }
  }

   return (
      <div>
        <div>
          <Header list={['REGISTER', 'ABOUT']}></Header>
        </div>
        <div className="mt-32 ml-32 w-auto absolute">
          <h1 className="text-5xl">Login to account</h1>
          <div>
          <p className="mt-5 text-gray-700">Don't have one? <Link to="/register" className="text-blue-700 underline">Login</Link></p>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
          <div className="mt-3">
            <div>
              <label className="block">Username</label>
              <input type="text" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="email" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleLogin(e):''}></input>
            </div>
            <div className="mt-3">
              <label className="block">Password</label>
              <input type="password" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="pass1" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleLogin(e):''}></input>
            </div>
            <button className="mt-5 bg-black text-white w-full h-11 rounded text-xl" onClick={handleLogin}>Login</button>
          </div>
          
        </div>
        </div>
      </div>
    )
}

export default Login