import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <h1>CryptoRealm</h1>
      <ul>
        <li>
          All rights reserved &copy; {new Date().getFullYear()}
        </li>
      </ul>
    </div>
  );
}

export default Footer;
