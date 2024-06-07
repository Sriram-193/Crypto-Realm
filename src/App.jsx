import { useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Home from './pages/Home/Home'
import Crypto from './pages/Crypto/Crypto'
import "./App.css"
import News from './pages/News/News'
import Details from './pages/Details/Details'
function App() {
  return (
    <>
    
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/crypto' element={<Crypto/>}/>
        <Route path='/details/:id' element={<Details/>}/>
        <Route path='/news' element={<News/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
