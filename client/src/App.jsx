import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Body from './components/Body'

function App() {
  axios.defaults.withCredentials = true;
  return (
    <>
      <Navbar/>
      <Body/>
    </>
  )
}

export default App
