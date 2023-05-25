import React from 'react'
import Logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const Header = ({ list }) => {
    const navigate = useNavigate()

    function handleClick(x){
        if(x === "REGISTER"){
            return navigate('/register')
        }else if(x === "LOGIN"){
            return navigate('/login')
        }else if(x === "ABOUT"){
            return navigate('/about')
        }
    }

    function handleLogo(){
        return navigate('/')
    }

  return (
    <div className="flex justify-between items-center">
        <img className="h-10 mt-3 ml-3 cursor-pointer" src={Logo} onClick={handleLogo}></img>
        <div className="flex text-xl">
            {list.map((x, index) => {
                if (index === 0){
                    return <h3 key={index} className="mr-5 ml-5 cursor-pointer" onClick={() => handleClick(x)}>{x}</h3>
                }else{
                    return <h3 key={index} className="mr-5 cursor-pointer" onClick={() => handleClick(x)}>{x}</h3>
                }
            })}
        </div>
    </div>
  )
}

export default Header