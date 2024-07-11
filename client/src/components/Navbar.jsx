import React from 'react'
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className='px-6 mb-2 flex justify-between items-center text-2xl font-bold bg-gradient-to-r from-black/40% to-cyan/100%'>
      <div className="logo">
        <a href="/">Cyber Key</a>
      </div>
      <ul className=' flex space-x-8 text-lg font-medium'>
        <li><a href="/" className="hover:font-bold hover:text-purple-600">Home</a></li>
        <li><a href="/about" className="hover:font-bold hover:text-purple-600">About</a></li>
        <li><a href="/contact" className="hover:font-bold hover:text-purple-600">Contact</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
