import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import Logo from "../asset/Logo maker project (3).png"
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className='navBar'>
    <div>
       <img src={Logo} alt="" />
     <h1>CryptoRealm</h1>
    </div>
   
     <ul>
     <li>
     <NavLink to={"/"} >
     <IoHomeOutline /> Home
        </NavLink>
     </li>
     <li>
     <NavLink to={"/crypto"}>
     <AiOutlineLineChart />  Cryptocurrencies
        </NavLink>
     </li>
     <li>
     <NavLink to={"/news"}>
     <FaRegNewspaper />  News
        </NavLink>
     </li>
    
     </ul>
       
       
    </div>
  )
}

export default Navbar