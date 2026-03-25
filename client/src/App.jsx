import { api } from './utilities'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'

function App() {
  const [user, setUser] = useState(useLoaderData())

  useEffect(()=>{
    console.log(user)
  }, [user])

  const test_connection = async() =>{
    let response = await api.get("test/")
    console.log(response)
  }

  useEffect(()=>{
    test_connection()
  },[])

  return (
    <>
      <NavBar /> 
      <Outlet context={{ user, setUser }}/>
    </>
  )
}

export default App
