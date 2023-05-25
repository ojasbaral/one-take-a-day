import React from 'react'

const Error = ({ msg, clear }) => {

    if(msg !== '')
        return (
        <div className="bg-[#ff0033] h-auto p-2 mt-3 rounded flex justify-between">
                <p className=" text-white">{msg}</p>
                <a className="text-white font-bold hover:cursor-pointer" onClick={clear}>&#10005;</a>
        </div>
        )
    else {
      return (<></>)
    }
}

export default Error