import React, { useState, useEffect } from 'react'
import Header from '../components/header'
import { useNavigate, Link } from 'react-router-dom'
import Error from '../components/error'
import Loading from '../components/loading'

const Register = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [passwordOne, setPasswordOne] = useState('')
  const [passwordTwo, setPasswordTwo] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [userId, setUserId] = useState('')
  const [valid, setValid] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const result = async () => {
        try{
          await fetch('https://api.onetakeaday.com' + '/auth/login', {
              method: "POST",
              body: JSON.stringify({
                  username: username,
                  password: passwordOne
              }),
              headers: {
                  "Content-type": "application/json",
              },
              credentials: "include"
            }).then((response) => {
              return response.json()
            })
            .then((json) => {   
              //console.log(json)
              if (json.message && json.message === "already authorized"){
                  setUserId(json.id)
                  setValid(false)
              }
              setLoading(false)
              //console.log(json)
              return () => {}
          })
    } catch (e) {
        //console.log(e)
        return navigate('/error')
    }
        }
        result()
    }, [])

    if(!valid){
      return navigate("/home/" + userId)
    }

  async function handleRegisterBtn(e){
    e.preventDefault()
    if((email === '') || (passwordOne === '') || (passwordTwo === '')){
      setErrorMsg("All fields are required")
    }else if(!(email.includes('@'))){
      setErrorMsg('Email must be a real email')
    }else if((passwordOne.length < 8)){
      setErrorMsg('Password must be 8 characters')
    }else if((passwordOne.length > 50)){
      setErrorMsg('Password must be less than 50 characters')
    }else if(passwordOne !== passwordTwo){
      setErrorMsg('Passwords must match')
    }else{
      await registerStepOne()
    }
    //CHECK IF EMAIL ALREADY EXISTS
  }

  async function registerStepOne(){
    try{
      await fetch(('https://api.onetakeaday.com' + '/auth/register/' + email), {
        method: "GET",
        credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        if(json.message === 'failure')
          setErrorMsg('Email Already Registered')
        else {
          setErrorMsg('')
          setStep(2)
        }
      })
    }catch (e){
      return navigate('/error')
    }
  }


  async function handleCompleteBtn(e){
    e.preventDefault()
    if((username === '') || (displayName === '')){
      setErrorMsg("Username and Display Name are required")
    }else{
      await registerStepTwo()
    }
  }

  async function registerStepTwo(){
    try{
      await fetch('https://api.onetakeaday.com' + '/auth/register', {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: passwordOne,
          username: username, 
          displayName: displayName, 
          bio: bio
        }),
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include"
      }).then((res) => res.json())
      .then((json) => {
        if (json.message === "username already in use"){
          setErrorMsg("Username already in use")
        }else {
          setErrorMsg('')
          setUserId(json.id)
          return navigate("/home/" + json.id)
        }
      })
    }catch (e){
      return navigate('/error')
    }
  }

  if(loading){
    return <div className="flex align-center justify-center m-auto">
      <Loading></Loading>
    </div>
  }
  
  if(step === 1){
    return (
      <div>
        <div>
          <Header list={['LOGIN', 'ABOUT']}></Header>
        </div>
        <div className="mt-20 ml-32 w-auto absolute">
          <h1 className="text-5xl">Create your account</h1>
          <div>
          <p className="mt-5 text-gray-700">Already have one? <Link to="/login" className="text-blue-700 underline">Login</Link></p>
          <p className="mt-5 text-2xl">Step {step}</p>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
          <div className="mt-3">
            <div>
              <label className="block">Email</label>
              <input type="text" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleRegisterBtn(e):''}></input>
            </div>
            <div className="mt-3">
              <label className="block">Password</label>
              <input type="password" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="pass1" placeholder="Enter Password" value={passwordOne} onChange={(e) => setPasswordOne(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleRegisterBtn(e):''}></input>
            </div>
            <div className="mt-3">
              <label className="block">Retype Password</label>
              <input type="password" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="pass2" placeholder="Re-enter Password" value={passwordTwo} onChange={(e) => setPasswordTwo(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleRegisterBtn(e):''}></input>
            </div>
            <button className="mt-5 bg-black text-white w-full h-11 rounded text-xl" onClick={handleRegisterBtn}>Register</button>
          </div>

          
        </div>
        </div>
      </div>
    )
  }else{
    return (
      <div>
        <div>
          <Header list={['LOGIN', 'ABOUT']}></Header>
        </div>
        <div className="mt-20 ml-32 w-auto absolute">
          <h1 className="text-5xl">Create your account</h1>
          <div>
          <p className="mt-5 text-gray-700">Already have one? <Link to="/login" className="text-blue-700 underline">Login</Link></p>
          <div className="flex justify-between items-center mt-5">
          <p className="text-2xl">Step {step}</p>
          <a className="text-blue-700 underline cursor-pointer" onClick={() => setStep(1)}>Back</a>
          </div>
          <Error msg={errorMsg} clear={() => setErrorMsg('')}></Error>
          <div className="mt-3">
            <div>
              <label className="block">Username</label>
              <input type="text" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleCompleteBtn(e):''}></input>
            </div>
            <div className="mt-3">
              <label className="block">Display Name</label>
              <input type="text" className="w-full border-0 border-b border-black h-8 focus:ring-0" key="displayName" placeholder="Enter Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} onKeyPress={(e) => (e.key === 'Enter')?handleCompleteBtn(e):''}></input>
            </div>
            <div className="mt-3">
              <label className="block">Bio</label>
              <textarea className="w-full border-0 border-b border-r border-black focus:ring-0" placeholder="E.g. I like basketball, football, and tennis." key="bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
            </div>
            <button className="mt-5 bg-black text-white w-full h-11 rounded text-xl" onClick={handleCompleteBtn}>Complete</button>
          </div>
          
        </div>
        </div>
      </div>
    )
  }
}

export default Register