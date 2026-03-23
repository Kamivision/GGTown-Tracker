import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    console.log(user)
  }, [user])

  return (
    <>
     <Outlet context={{ user, setUser }}/>
    </>
  )
}

export default App
