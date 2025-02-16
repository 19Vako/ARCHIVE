import React from 'react';
import "./styles/admin.css";
import Header from '../components/Header';
import AddManager from '../components/AddManager';
import { Link } from 'react-router-dom';



function Admin() {


  return (
    <div className='adminContainer'>
      <Header />
      <nav className='choiseOption'>
        <Link className='addManager' to=''>Додати менеджера <img src={require('../icons/userIcon.png')} alt=''/></Link>
        <Link className='addCard' to=''><img src={require('../icons/inbox-icon.png')} alt=''/> Додати картку</Link>
      </nav>
      <main className='mainContainer'>
        <AddManager/>
      </main>
      
    </div>
  )
}

export default Admin