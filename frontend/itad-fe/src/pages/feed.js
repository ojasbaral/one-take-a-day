import React, { useState, useEffect} from 'react'
import VerticalHeader from '../components/verticalHeader'

const Feed = () => {
  const [date, setDate] = useState('')

  useEffect(()=> {
    formatDate(new Date())
  }, [])

  function formatDate(uDate){
    const day = uDate.getDay()
    const month = uDate.getMonth()
    const d = uDate.getDate()

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const temp = days[day] + ', ' + months[month] + ' ' + d
    setDate(temp.toUpperCase())
  }


  return (
    <div className="flex justify-between ">
      <VerticalHeader></VerticalHeader>
      <div className="mr-20 mt-4 text-3xl w-full ml-32">
        <h1 className="text-right">{date}</h1>
        <div className="w-auto h-auto border-black border-solid border-2 mt-8 rounded">
        <textarea className="w-full border-0 h-24 resize-none focus:ring-0" placeholder="ONLY ONE TAKE A DAY, MAKE IT COUNT..."></textarea>
        <div className="flex justify-between">
        <button className="w-auto pl-2 rounded pr-2 h-8 border-black border-solid border-2 ml-1 text-xl hover:bg-black hover:text-white">+ HASHTAGS</button>
        <button className="bg-black text-white w-1/4 h-8 rounded text-xl mr-1 mb-1 hover:bg-white hover:text-black hover:border-2 hover:border-black hover:border-solid">POST</button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Feed